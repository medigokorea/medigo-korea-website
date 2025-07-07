import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes
let routesInitialized = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Initialize routes only once
    if (!routesInitialized) {
      await registerRoutes(app);
      routesInitialized = true;
    }
    
    // Handle the request
    app(req as any, res as any);
  } catch (error) {
    console.error('API Handler error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}