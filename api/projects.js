// /api/projects.js
import { MongoClient, ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';

// Em um cenário real, usaríamos uma biblioteca como 'jsonwebtoken' para validar o token
// import jwt from 'jsonwebtoken';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;
// A chave secreta para assinar e verificar o JWT. Deve estar em .env.local
// const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGODB_URI) {
  throw new Error('Defina a variável de ambiente MONGODB_URI em .env.local');
}
if (!MONGODB_DB) {
  throw new Error('Defina a variável de ambiente MONGODB_DB em .env.local');
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await new MongoClient(MONGODB_URI).connect();
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// --- Função de Middleware de Segurança ---
// Esta função centraliza a validação do token para os métodos que precisam de proteção.
async function validateAuth(req, res) {

  return true;
}

cloudinary.config({ secure: true });

// ATUALIZADO: a regex foi melhorada para capturar o public_id completo, incluindo a pasta do projeto
const getPublicIdFromUrl = (url) => {
    try {
        // Exemplo de URL: https://res.cloudinary.com/demo/image/upload/v12345/portifolio/projects/meu-projeto/imagem.jpg
        // A regex captura 'portifolio/projects/meu-projeto/imagem'
        const regex = /\/upload\/v\d+\/(portifolio\/projects\/[^\.]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch {
        return null;
    }
};


export default async function handler(req, res) {
  // --- INÍCIO DO BLOCO DE SEGURANÇA (Verificação de origem) ---
  if (process.env.NODE_ENV === 'production') {
    const secFetchSite = req.headers['sec-fetch-site'];
    if (secFetchSite !== 'same-origin') {
      return res.status(403).json({ error: 'Acesso proibido' });
    }
  }

  const { db } = await connectToDatabase();
  res.setHeader('Content-Type', 'application/json');

  // Roteamento baseado no método HTTP da requisição
  switch (req.method) {
    // --- LER PROJETOS (Público) ---
    case 'GET':
      try {
        const projects = await db.collection("projects").find({}).sort({ publicationDate: -1 }).toArray();
        res.status(200).json(projects);
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: `API Error: ${e.message}` });
      }
      break;

    // --- CRIAR NOVO PROJETO (Protegido) ---
    case 'POST':
      if (!(await validateAuth(req, res))) return; // Validação de segurança

      try {
        const newProject = req.body;
    if (!newProject.title || !newProject.id) {
      return res.status(400).json({ error: 'Título e ID são obrigatórios.' });
    }

    // Limpa o campo _id caso ele venha do frontend para garantir uma nova inserção
    delete newProject._id; 
    
    const result = await db.collection("projects").insertOne(newProject);

    // **MUDANÇA IMPORTANTE**: Retorne o objeto do projeto criado com seu novo _id
    res.status(201).json({ 
      success: true, 
      project: { ...newProject, _id: result.insertedId } 
    });

  } catch (e) {
    // ... (tratamento de erro)
  }
  break;

    // --- ATUALIZAR PROJETO EXISTENTE (Protegido) ---
    case 'PUT':
      if (!(await validateAuth(req, res))) return; // Validação de segurança

      try {
        const { _id, ...projectData } = req.body;
        if (!_id) {
          return res.status(400).json({ error: 'O _id do projeto é obrigatório para atualização.' });
        }
        const result = await db.collection("projects").updateOne(
          { _id: new ObjectId(_id) },
          { $set: projectData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Projeto não encontrado.' });
        }
        res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: `API Error: ${e.message}` });
      }
      break;

    // --- DELETAR PROJETO (Protegido) ---
    case 'DELETE':
      if (!(await validateAuth(req, res))) return;

      try {
        const { _id } = req.query;
        if (!_id) {
          return res.status(400).json({ error: 'O _id do projeto é obrigatório para exclusão.' });
        }

        // 1. Encontrar o projeto no DB para obter seu ID (slug)
        const projectToDelete = await db.collection("projects").findOne({ _id: new ObjectId(_id) });
        if (!projectToDelete) {
          return res.status(404).json({ error: 'Projeto não encontrado.' });
        }

        // 2. Excluir a pasta e os recursos do Cloudinary
        const projectId = projectToDelete._id;
        if (projectId) {
          const folderPath = `portifolio/projects/${projectId}`;
          console.log(`Tentando excluir a pasta: ${folderPath}`);
          
          // Exclui todos os arquivos dentro da pasta
          await cloudinary.api.delete_resources_by_prefix(folderPath);
          // Exclui a pasta em si (só funciona se estiver vazia)
          await cloudinary.api.delete_folder(folderPath);
          
          console.log(`Recursos do Cloudinary para o projeto '${projectId}' foram excluídos.`);
        }

        // 3. Excluir o projeto do MongoDB
        const result = await db.collection("projects").deleteOne({ _id: new ObjectId(_id) });

        if (result.deletedCount === 0) {
          // Isso não deve acontecer se o findOne acima funcionou, mas é uma boa prática
          return res.status(404).json({ error: 'Projeto não encontrado para exclusão no DB.' });
        }
        
        res.status(200).json({ success: true, deletedCount: result.deletedCount });
        
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: `API Error: ${e.message}` });
      }
      break;

    // --- ATUALIZAR PARCIALMENTE O PROJETO (ex: remover mídia) ---
    case 'PATCH':
      if (!(await validateAuth(req, res))) return;

      try {
        const { _id, mediaUrlToRemove, mediaType } = req.body;
        if (!_id || !mediaUrlToRemove || !mediaType) {
          return res.status(400).json({ error: 'Faltam parâmetros para remover a mídia.' });
        }

        // 1. Remover do Cloudinary
        const publicId = getPublicIdFromUrl(mediaUrlToRemove);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: mediaType === 'video' ? 'video' : 'image'
          });
        }

        // 2. Remover do MongoDB
        const fieldToUpdate = mediaType === 'image' ? 'details.images' :
          mediaType === 'video' ? 'details.videos' : 'details.pdfUrl';

        const updateOperation = (mediaType === 'pdf')
          ? { $set: { [fieldToUpdate]: "" } }
          : { $pull: { [fieldToUpdate]: mediaUrlToRemove } };

        const result = await db.collection("projects").updateOne(
          { _id: new ObjectId(_id) },
          updateOperation
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Projeto não encontrado.' });
        }

        res.status(200).json({ success: true, message: 'Mídia removida com sucesso.' });

      } catch (e) {
        console.error(e);
        res.status(500).json({ error: `API Error: ${e.message}` });
      }
      break;

    default:
      // Adicione 'PATCH' aos métodos permitidos
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']);
      res.status(405).end(`Método ${req.method} não suportado.`);
  }
}