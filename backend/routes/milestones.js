import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// Create a new milestone
router.post('/create', (req, res) => {
    try {
        const { canvasId, name, reason } = req.body;

        if (!canvasId || !name) {
            return res.status(400).json({ 
                error: 'Missing required fields: canvasId, name' 
            });
        }

        // Get current canvas state
        const canvas = db.getCanvas(canvasId);
        
        if (!canvas) {
            return res.status(404).json({ error: 'Canvas not found' });
        }

        // Create milestone with current canvas state
        const milestone = db.createMilestone(
            canvasId,
            name,
            reason || '',
            JSON.parse(canvas.content),
            JSON.parse(canvas.structure)
        );

        res.json({
            success: true,
            milestone: {
                id: milestone.id,
                name: milestone.name,
                reason: milestone.reason,
                createdAt: milestone.created_at
            }
        });
    } catch (error) {
        console.error('Error creating milestone:', error);
        res.status(500).json({ error: 'Failed to create milestone' });
    }
});

// Get all milestones for a canvas
router.get('/:canvasId', (req, res) => {
    try {
        const { canvasId } = req.params;

        const milestones = db.getMilestones(canvasId);

        res.json({
            canvasId,
            count: milestones.length,
            milestones: milestones.map(m => ({
                id: m.id,
                name: m.name,
                reason: m.reason,
                createdAt: m.created_at
            }))
        });
    } catch (error) {
        console.error('Error fetching milestones:', error);
        res.status(500).json({ error: 'Failed to fetch milestones' });
    }
});

// Get specific milestone details
router.get('/:canvasId/:milestoneId', (req, res) => {
    try {
        const { canvasId, milestoneId } = req.params;

        const milestones = db.getMilestones(canvasId);
        const milestone = milestones.find(m => m.id === milestoneId);

        if (!milestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        res.json({
            id: milestone.id,
            canvasId: milestone.canvas_id,
            name: milestone.name,
            reason: milestone.reason,
            content: JSON.parse(milestone.content),
            structure: JSON.parse(milestone.structure),
            createdAt: milestone.created_at
        });
    } catch (error) {
        console.error('Error fetching milestone:', error);
        res.status(500).json({ error: 'Failed to fetch milestone' });
    }
});

// Compare two milestones
router.get('/compare/:canvasId/:milestone1Id/:milestone2Id', (req, res) => {
    try {
        const { canvasId, milestone1Id, milestone2Id } = req.params;

        const milestones = db.getMilestones(canvasId);
        const m1 = milestones.find(m => m.id === milestone1Id);
        const m2 = milestones.find(m => m.id === milestone2Id);

        if (!m1 || !m2) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const s1 = JSON.parse(m1.structure);
        const s2 = JSON.parse(m2.structure);

        // Simple comparison of section count and titles
        const differences = {
            sectionsAdded: s2.sections.length - s1.sections.length,
            sectionsChanged: s2.sections.filter((s, i) => 
                s1.sections[i] && s.title !== s1.sections[i].title
            ).length
        };

        res.json({
            milestone1: {
                id: m1.id,
                name: m1.name,
                createdAt: m1.created_at
            },
            milestone2: {
                id: m2.id,
                name: m2.name,
                createdAt: m2.created_at
            },
            differences
        });
    } catch (error) {
        console.error('Error comparing milestones:', error);
        res.status(500).json({ error: 'Failed to compare milestones' });
    }
});

export default router;
