// /api/projects.js
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

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

  const client = await MongoClient.connect(MONGODB_URI);
  const db = await client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req, res) {
  // --- INÍCIO DO BLOCO DE SEGURANÇA ---
  // Em ambiente de produção, verificamos de onde veio a requisição
  if (process.env.NODE_ENV === 'production') {
    const secFetchSite = req.headers['sec-fetch-site'];
    // Se o header não for 'same-origin', bloqueamos o acesso.
    if (secFetchSite !== 'same-origin') {
      return res.status(403).json({ error: 'Acesso proibido' });
    }
  }
  // --- FIM DO BLOCO DE SEGURANÇA ---

  try {
    const { db } = await connectToDatabase();
    const projects = await db.collection("projects").find({}).toArray();
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(projects);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: `API Error: ${e.message}` });
  }
}