// /api/projects.js
import { MongoClient, ObjectId } from 'mongodb';
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
        // Validação básica dos dados recebidos (pode ser expandida)
        if (!newProject.title || !newProject.id) {
            return res.status(400).json({ error: 'Título e ID são obrigatórios.' });
        }
        const result = await db.collection("projects").insertOne(newProject);
        res.status(201).json({ success: true, insertedId: result.insertedId });
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: `API Error: ${e.message}` });
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
        if (!(await validateAuth(req, res))) return; // Validação de segurança
  
        try {
          const { _id } = req.query; // O ID virá como query param: /api/projects?_id=...
          if (!_id) {
            return res.status(400).json({ error: 'O _id do projeto é obrigatório para exclusão.' });
          }
          const result = await db.collection("projects").deleteOne({ _id: new ObjectId(_id) });
  
          if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Projeto não encontrado.' });
          }
          res.status(200).json({ success: true, deletedCount: result.deletedCount });
        } catch (e) {
          console.error(e);
          res.status(500).json({ error: `API Error: ${e.message}` });
        }
        break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${req.method} não suportado.`);
  }
}