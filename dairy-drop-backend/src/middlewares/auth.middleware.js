import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/user.model.js';

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const token = header.slice(7);
  try {
    const payload = verifyToken(token);

    // Check if user is still active
    const user = await User.findById(payload.id).select('isActive');
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated. Access denied.' });
    }

    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}