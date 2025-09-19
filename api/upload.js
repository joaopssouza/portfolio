// /api/upload.js
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';

// Configuração segura do Cloudinary com variáveis de ambiente
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  // Usamos um truque para rodar o middleware do Multer em uma função serverless
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Falha no processamento do upload.', details: err.message });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      }
      const uploadPromises = req.files.map(file => streamUpload(file.buffer));
      const results = await Promise.all(uploadPromises);
      // Retornamos as URLs seguras dos arquivos que foram enviados
      const urls = results.map(result => result.secure_url);
      res.status(200).json({ success: true, urls });
    } catch (e) {
      console.error('Erro ao fazer upload para o Cloudinary:', e);
      res.status(500).json({ error: `Erro na API de Upload: ${e.message}` });
    }
  });
}