import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import canvasRouter from './routes/canvas.js';
import trackingRouter from './routes/tracking.js';
import milestonesRouter from './routes/milestones.js';
import insightsRouter from './routes/insights.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(join(__dirname, 'public')));

// Routes
app.use('/api/canvas', canvasRouter);
app.use('/api/tracking', trackingRouter);
app.use('/api/milestones', milestonesRouter);
app.use('/api/insights', insightsRouter);

// Canvas viewer route
app.get('/canvas/:id', (req, res) => {
    res.sendFile(join(__dirname, 'public/viewer.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Canvas backend is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Canvas Backend running on http://localhost:${PORT}`);
    console.log(`📊 Canvas viewer: http://localhost:${PORT}/canvas/:id`);
    console.log(`✨ Milestones API: http://localhost:${PORT}/api/milestones`);
});
