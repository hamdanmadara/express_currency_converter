import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config, validateConfig } from './config/config';
import { currencyRoutes } from './routes/currency.routes';
import { errorMiddleware } from './middleware/error.middleware';

// Validate the required environment variables
validateConfig();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration - Updated to allow all origins
    this.app.use(cors({
      origin: '*',  // Allow all origins to fix CORS issues
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    // Request logging
    this.app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
    
    // Parse JSON request body
    this.app.use(express.json());
    
    // Parse URL-encoded request body
    this.app.use(express.urlencoded({ extended: true }));
  }

  private configureRoutes(): void {
    // API routes
    this.app.use('/api', currencyRoutes);
    
    // Health check route
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    
    // 404 handler for undefined routes
    this.app.use('*', (req, res) => {
      res.status(404).json({
        status: 'error',
        message: `Cannot ${req.method} ${req.originalUrl}`
      });
    });
  }

  private configureErrorHandling(): void {
    // Global error handling middleware
    this.app.use(errorMiddleware);
  }
}

export default new App().app;