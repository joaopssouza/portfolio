// /api/upload.js
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';

// A configuração é agora lida diretamente das variáveis de ambiente sincronizadas
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadMiddleware = upload.array('media');

export const config = {
  api: {
    bodyParser: false,
  },
};

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'portifolio/projects', resource_type: 'auto' },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          // Rejeita a promessa com a mensagem de erro específica
          reject(new Error(error ? error.message : 'Erro desconhecido do Cloudinary.'));
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

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Falha no processamento do Multer.', details: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum ficheiro foi enviado.' });
    }

    try {
      const uploadPromises = req.files.map(file => streamUpload(file.buffer));
      const results = await Promise.all(uploadPromises);
      const urls = results.map(result => result.secure_url);
      
      res.status(200).json({ success: true, urls });
    } catch (e) {
      console.error('Erro detalhado no upload:', e);
      // Retorna a mensagem de erro específica para o frontend
      res.status(500).json({ error: `Erro na API de Upload: ${e.message}` });
    }
  });
}