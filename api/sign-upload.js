
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
const { verify } = jwt;
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

// Garante configuração
if (!process.env.CLOUDINARY_URL) {
    throw new Error('CLOUDINARY_URL missing');
}
cloudinary.config({ secure: true });

async function validateAuth(req, res) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.auth_token;

    if (!token) {
        res.status(401).json({ error: 'Acesso não autorizado' });
        return false;
    }
    try {
        verify(token, JWT_SECRET);
        return true;
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
        return false;
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!(await validateAuth(req, res))) return;

    try {
        const { folder, type } = req.body;
        const timestamp = Math.round((new Date).getTime() / 1000);

        // Definir transformações Eager (Assíncronas) baseadas no tipo
        let eager = '';
        if (type === 'video') {
            eager = 'f_webm,q_auto';
        } else if (type === 'image') {
            eager = 'f_webp,q_auto';
        }

        // Parâmetros para assinar
        const paramsToSign = {
            timestamp: timestamp,
            folder: folder || 'portifolio/general', // Pasta padrão
            // Eager transformations ou outras configs podem ir aqui
        };

        if (eager) {
            paramsToSign.eager = eager;
            paramsToSign.eager_async = true; // Processar em background para não travar upload
        }

        const signature = cloudinary.utils.api_sign_request(paramsToSign, cloudinary.config().api_secret);

        res.status(200).json({
            signature,
            timestamp,
            eager, // Retornar para o frontend enviar junto
            apiKey: cloudinary.config().api_key,
            cloudName: cloudinary.config().cloud_name
        });
    } catch (error) {
        console.error('Sign error:', error);
        res.status(500).json({ error: error.message });
    }
}
