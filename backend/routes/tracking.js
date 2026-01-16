import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// Track section view
router.post('/view', (req, res) => {
    try {
        const { canvasId, sectionId, timeSpent } = req.body;

        if (!canvasId || !sectionId) {
            return res.status(400).json({ 
                error: 'Missing required fields: canvasId, sectionId' 
            });
        }

        db.trackView(canvasId, sectionId, timeSpent || 0);

        res.json({ success: true });
    } catch (error) {
        console.error('Error tracking view:', error);
        res.status(500).json({ error: 'Failed to track view' });
    }
});

// Get blind spots (unviewed sections)
router.get('/blind-spots/:canvasId', (req, res) => {
    try {
        const { canvasId } = req.params;

        // Get canvas structure
        const canvas = db.getCanvas(canvasId);

        if (!canvas) {
            return res.status(404).json({ error: 'Canvas not found' });
        }

        const structure = JSON.parse(canvas.structure);

        // Get tracking data
        const trackingData = db.getTracking(canvasId);
        const trackingArray = Object.values(trackingData);

        // Find blind spots
        const blindSpots = trackingArray
            .filter(t => !t.viewed)
            .map(t => {
                const section = structure.sections.find(s => s.id === t.section_id);
                return {
                    sectionId: t.section_id,
                    sectionName: section?.title || 'Unknown Section',
                    message: `"${section?.title || 'Section'}" was not viewed`
                };
            });

        res.json({
            canvasId,
            totalSections: structure.sections.length,
            viewedSections: trackingArray.filter(t => t.viewed).length,
            blindSpots
        });
    } catch (error) {
        console.error('Error fetching blind spots:', error);
        res.status(500).json({ error: 'Failed to fetch blind spots' });
    }
});

export default router;
