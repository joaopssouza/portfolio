// /api/projects.js
import { MongoClient, ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;
const JWT_SECRET = process.env.JWT_SECRET;

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

// A função de validação permanece a mesma
async function validateAuth(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.auth_token;
  if (!token) {
    res.status(401).json({ error: 'Acesso não autorizado.' });
    return false;
  }
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
    return false;
  }
}

cloudinary.config({ secure: true });

const getPublicIdFromUrl = (url) => {
    try {
        const regex = /\/upload\/v\d+\/(portifolio\/projects\/[^\.]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch {
        return null;
    }
};


export default async function handler(req, res) {
  if (process.env.NODE_ENV === 'production') {
    const secFetchSite = req.headers['sec-fetch-site'];
    if (secFetchSite !== 'same-origin') {
      return res.status(403).json({ error: 'Acesso proibido' });
    }
  }

  const { db } = await connectToDatabase();
  res.setHeader('Content-Type', 'application/json');

  switch (req.method) {
    // --- ROTA GET (PÚBLICA) ---
    // NENHUMA CHAMADA a validateAuth aqui.
    case 'GET':
      try {
        const projects = await db.collection("projects").find({}).sort({ publicationDate: -1 }).toArray();
        res.status(200).json(projects);
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: `API Error: ${e.message}` });
      }
      break;

    // --- ROTA POST (PROTEGIDA) ---
    case 'POST':
      if (!(await validateAuth(req, res))) return; // Proteção aqui
      try {
        const newProject = req.body;
        if (!newProject.title || !newProject.id) {
          return res.status(400).json({ error: 'Título e ID são obrigatórios.' });
        }
        delete newProject._id;
        const result = await db.collection("projects").insertOne(newProject);
        res.status(201).json({
          success: true,
          project: { ...newProject, _id: result.insertedId }
        });
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: `API Error: ${e.message}` });
      }
      break;

    // --- ROTA PUT (PROTEGIDA) ---
    case 'PUT':
      if (!(await validateAuth(req, res))) return; // Proteção aqui
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

    // --- ROTA DELETE (PROTEGIDA) ---
    case 'DELETE':
      if (!(await validateAuth(req, res))) return; // Proteção aqui
      try {
        const { _id } = req.query;
        if (!_id) {
          return res.status(400).json({ error: 'O _id do projeto é obrigatório para exclusão.' });
        }
        
        const projectToDelete = await db.collection("projects").findOne({ _id: new ObjectId(_id) });
        if (!projectToDelete) {
          return res.status(404).json({ error: 'Projeto não encontrado.' });
        }

        const projectId = projectToDelete.id;
        if (projectId) {
          const folderPath = `portifolio/projects/${projectId}`;
          console.log(`Tentando excluir recursos na pasta: ${folderPath}`);
          
          await cloudinary.api.delete_resources_by_prefix(folderPath, { resource_type: 'image' });
          await cloudinary.api.delete_resources_by_prefix(folderPath, { resource_type: 'video' });
          
          try {
            await cloudinary.api.delete_folder(folderPath);
            console.log(`Pasta '${folderPath}' do Cloudinary foi excluída.`);
          } catch (folderError) {
            if (folderError.error.http_code !== 404) {
              throw folderError;
            }
          }
        }

        const result = await db.collection("projects").deleteOne({ _id: new ObjectId(_id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Projeto não encontrado para exclusão no DB.' });
        }
        
        res.status(200).json({ success: true, deletedCount: result.deletedCount });
        
      } catch (e) {
        console.error('Erro detalhado ao deletar:', e);
        const errorMessage = e.error ? e.error.message : e.message;
        res.status(500).json({ error: `API Error: ${errorMessage}` });
      }
      break;

    // --- ROTA PATCH (PROTEGIDA) ---
    case 'PATCH':
      if (!(await validateAuth(req, res))) return; // Proteção aqui
      try {
        const { _id, mediaUrlToRemove, mediaType } = req.body;
        if (!_id || !mediaUrlToRemove || !mediaType) {
          return res.status(400).json({ error: 'Faltam parâmetros para remover a mídia.' });
        }
        const publicId = getPublicIdFromUrl(mediaUrlToRemove);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: mediaType === 'video' ? 'video' : 'image'
          });
        }
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
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']);
      res.status(405).end(`Método ${req.method} não suportado.`);
  }
}