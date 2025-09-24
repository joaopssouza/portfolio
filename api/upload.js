// /api/upload.js
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';

// Configuração do Cloudinary usando URL
if (!process.env.CLOUDINARY_URL) {
  throw new Error('CLOUDINARY_URL não está definida');
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
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: 'portifolio/projects', // Pasta de destino no Cloudinary
        resource_type: 'auto' // Detecta se é imagem ou vídeo
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
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
        console.log(`Enviando arquivo: ${file.originalname}, tamanho: ${file.size}`);
        return streamUpload(file.buffer);
      });

      const results = await Promise.all(uploadPromises);
      const urls = results.map(result => result.secure_url);
      
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