import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Admin access only' });
    return;
  }
  next();
};