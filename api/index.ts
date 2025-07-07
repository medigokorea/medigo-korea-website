import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('API Request:', req.method, req.url);
    
    // Simple health check
    if (req.method === 'GET' && req.url === '/api/health') {
      return res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    }
    
    // Handle API routes
    const path = req.url?.replace('/api', '') || '/';
    
    if (path.startsWith('/quotation-requests')) {
      if (req.method === 'POST') {
        // Mock quotation request response
        return res.status(200).json({ 
          id: Date.now(),
          message: 'Quotation request received',
          data: req.body 
        });
      }
      if (req.method === 'GET') {
        return res.status(200).json({ 
          quotations: [],
          message: 'Database connection will be restored in next update'
        });
      }
    }
    
    if (path.startsWith('/contact-requests')) {
      if (req.method === 'POST') {
        return res.status(200).json({ 
          id: Date.now(),
          message: 'Contact request received',
          data: req.body 
        });
      }
      if (req.method === 'GET') {
        return res.status(200).json({ 
          contacts: [],
          message: 'Database connection will be restored in next update'
        });
      }
    }
    
    // Auth routes
    if (path === '/auth/login' && req.method === 'POST') {
      const { password } = req.body;
      if (password === process.env.ADMIN_PASSWORD) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }
    
    return res.status(404).json({ message: 'API endpoint not found' });
    
  } catch (error) {
    console.error('API Handler error:', error);
    return res.status(500).json({ 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}