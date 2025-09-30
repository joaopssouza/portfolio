// /api/auth/status.js
import jwt from 'jsonwebtoken'; // Alteração aqui
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.auth_token;

  if (!token) {
    return res.status(200).json({ isAuthenticated: false });
  }

  try {
    // Usamos jwt.verify em vez de apenas verify
    jwt.verify(token, JWT_SECRET); // Alteração aqui
    return res.status(200).json({ isAuthenticated: true });
  } catch (error) {
    return res.status(200).json({ isAuthenticated: false });
  }
}