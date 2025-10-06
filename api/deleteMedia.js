// /api/deleteMedia.js
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
const { verify } = jwt;
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

// --- Função de Middleware de Segurança ---
async function validateAuth(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.auth_token;

  if (!token) {
    res.status(401).json({ error: 'Acesso não autorizado.' });
    return false;
  }

  try {
    verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
    return false;
  }
}

// O SDK do Cloudinary usa a variável de ambiente CLOUDINARY_URL automaticamente
cloudinary.config({ secure: true });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  // AQUI: Implemente sua lógica de autenticação/validação de sessão de admin
  
  const { public_ids } = req.body;

  if (!public_ids || !Array.isArray(public_ids) || public_ids.length === 0) {
    return res.status(400).json({ error: 'A lista de "public_ids" é obrigatória.' });
  }

  try {
    // Usamos `delete_resources` que pode deletar imagens e vídeos juntos
    const result = await cloudinary.api.delete_resources(public_ids, {
      type: 'upload',
      resource_type: 'auto' // 'auto' tentará detectar o tipo
    });

    res.status(200).json({ success: true, deleted: result.deleted });
  } catch (e) {
    console.error('Erro ao deletar do Cloudinary:', e);
    res.status(500).json({ error: 'Falha ao deletar recursos.', details: e.message });
  }
}