import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  logger.http(`📥 ${req.method} ${req.url} - IP: ${req.ip}`);
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.http(`📤 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  next();
}