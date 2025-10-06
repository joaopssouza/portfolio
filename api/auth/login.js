// /api/auth/login.js
import jwt from 'jsonwebtoken'; // Alteração aqui
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!JWT_SECRET || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error('As variáveis de ambiente JWT_SECRET, ADMIN_USERNAME e ADMIN_PASSWORD devem estar definidas.');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Usamos jwt.sign em vez de apenas sign
    const token = jwt.sign({ user: 'admin' }, JWT_SECRET, { expiresIn: '8h' }); // Alteração aqui

    res.setHeader('Set-Cookie', cookie.serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 horas
      path: '/',
    }));

    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'Credenciais inválidas.' });
}