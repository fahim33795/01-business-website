import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';

import apiRoutes from './routes/api.js';
import { seedData } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & Body Parser
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for file uploads
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Mount REST API
app.use('/api', apiRoutes);

// Serve Built Production Frontend Assets
const distDir = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Run database seeder
try {
  seedData();
} catch (err) {
  console.error('Failed to run database seeder:', err);
}

// Start Server
app.listen(PORT, () => {
  console.log(`
=====================================================
✨ Syvora Beauty & Lifestyle Platform Running ✨
📡 Website URL: http://localhost:5000
🔐 Admin Demo Email: admin@syvora.com (Pass: 12345)
=====================================================
  `);
});
