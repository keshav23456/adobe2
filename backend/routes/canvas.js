import express from 'express';
import { nanoid } from 'nanoid';
import db from '../db/database.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Publish document as Canvas
router.post('/publish', (req, res) => {
    try {
        const { title, content, structure } = req.body;

        if (!title || !content || !structure) {
            return res.status(400).json({ 
                error: 'Missing required fields: title, content, structure' 
            });
        }

        const canvasId = nanoid(10);
        
        // Create canvas
        db.createCanvas(canvasId, title, content, structure);

        // Initialize tracking for each section
        const sections = structure.sections || [];
        db.initTracking(canvasId, sections);

        res.json({
            success: true,
            canvasId,
            url: `http://localhost:3000/canvas/${canvasId}`,
            message: 'Document published as Canvas'
        });
    } catch (error) {
        console.error('Error publishing canvas:', error);
        res.status(500).json({ error: 'Failed to publish canvas' });
    }
});

// Get Canvas by ID
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        const canvas = db.getCanvas(id);

        if (!canvas) {
            return res.status(404).json({ error: 'Canvas not found' });
        }

        res.json({
            id: canvas.id,
            title: canvas.title,
            content: JSON.parse(canvas.content),
            structure: JSON.parse(canvas.structure),
            createdAt: canvas.created_at,
            updatedAt: canvas.updated_at
        });
    } catch (error) {
        console.error('Error fetching canvas:', error);
        res.status(500).json({ error: 'Failed to fetch canvas' });
    }
});


export default router;
