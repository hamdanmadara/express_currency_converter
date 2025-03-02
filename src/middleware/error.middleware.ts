import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';
import { config } from '../config/config';

/**
 * Error handling middleware
 */
export const errorMiddleware = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  // In development, include error details
  const details = config.nodeEnv === 'development' ? error.details || error.stack : undefined;
  
  console.error(`[${statusCode}] ${message}`, error);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(details && { details })
  });
};