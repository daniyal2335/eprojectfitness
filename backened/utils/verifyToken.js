import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Malformed token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: ..., email: ... }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
