export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'OK',
    service: 'Medigo Korea API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}