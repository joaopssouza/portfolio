// /api/upload.js
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';
import { verify } from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

// Configuração do Cloudinary usando URL
if (!process.env.CLOUDINARY_URL) {
  throw new Error('CLOUDINARY_URL não está definida');
}

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

// O cloudinary automaticamente detecta e usa CLOUDINARY_URL
cloudinary.config({ secure: true });

// Configuração do Multer para processar os arquivos em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadMiddleware = upload.array('media'); // 'media' é o nome do campo no formulário

// Função para desabilitar o parser padrão do Next.js/Vercel para esta rota
export const config = {
  api: {
    bodyParser: false,
  },
};

// Função auxiliar para fazer o upload de um buffer para o Cloudinary
const streamUpload = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    // Determina se é vídeo baseado na extensão do arquivo
    const isVideo = /\.(mp4|mov|avi|wmv)$/i.test(originalname);
    
    const uploadOptions = {
      folder: 'portifolio/projects',
      resource_type: isVideo ? 'video' : 'image',
      // Configurações de transformação
      transformation: isVideo ? [
        { fetch_format: 'webm' },
        { quality: 'auto' }
      ] : [
        { fetch_format: 'webp' },
        { quality: 'auto' },
        { flags: 'preserve_transparency' }
      ]
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Erro no upload:', error);
          reject(error);
        } else {
          console.log(`Arquivo convertido com sucesso: ${result.format}`);
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default async function handler(req, res) {
  // Verifica método HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  // Verifica configuração do Cloudinary
  if (!process.env.CLOUDINARY_URL) {
    console.error('CLOUDINARY_URL não está definida');
    return res.status(500).json({ error: 'Erro de configuração do servidor' });
  }

  // Processar upload
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error('Erro no middleware:', err);
      return res.status(500).json({ error: 'Falha no processamento do upload', details: err.message });
    }

    try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    console.log(`Processando ${req.files.length} arquivo(s)`);
    
    const uploadPromises = req.files.map(file => {
      console.log(`Enviando arquivo: ${file.originalname}, tipo: ${file.mimetype}`);
      return streamUpload(file.buffer, file.originalname);
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map(result => ({
      url: result.secure_url,
      format: result.format,
      resourceType: result.resource_type
    }));
    
    return res.status(200).json({ success: true, urls });
  } catch (e) {
    console.error('Erro no upload:', e);
    return res.status(500).json({ 
      error: 'Erro no upload para o Cloudinary',
      details: e.message 
    });
  }
  });
}