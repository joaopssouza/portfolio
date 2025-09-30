// /api/auth/status.js
import { verify } from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.auth_token;

  if (!token) {
    return res.status(200).json({ isAuthenticated: false });
  }

  try {
    verify(token, JWT_SECRET);
    return res.status(200).json({ isAuthenticated: true });
  } catch (error) {
    return res.status(200).json({ isAuthenticated: false });
  }
}