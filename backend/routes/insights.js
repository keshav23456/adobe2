import express from 'express';

const router = express.Router();

// Convert paragraph to bullet points
router.post('/generate', (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Missing required field: text' });
        }

        // Simple algorithm to generate insights
        const insights = generateInsights(text);

        res.json({
            success: true,
            original: text,
            insights
        });
    } catch (error) {
        console.error('Error generating insights:', error);
        res.status(500).json({ error: 'Failed to generate insights' });
    }
});

// Simple insight generation logic
function generateInsights(text) {
    // Split by sentences
    const sentences = text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 10);

    // If text is already short, return as is
    if (sentences.length <= 3 && text.length < 200) {
        return [text.trim()];
    }

    // Extract key sentences (simplified approach)
    const insights = [];

    // Try to find sentences with key indicators
    const keyIndicators = ['important', 'key', 'main', 'first', 'second', 'finally', 'must', 'should', 'will'];
    
    sentences.forEach((sentence, index) => {
        const lowerSentence = sentence.toLowerCase();
        const hasKeyword = keyIndicators.some(keyword => lowerSentence.includes(keyword));
        const isShortEnough = sentence.length < 150;
        
        // Include first sentence, sentences with keywords, or every 3rd sentence
        if (index === 0 || hasKeyword || index % 3 === 0) {
            if (isShortEnough && insights.length < 5) {
                // Clean and simplify the sentence
                let insight = sentence
                    .replace(/^(and|but|so|however|moreover|furthermore)/i, '')
                    .trim();
                
                if (insight.length > 10) {
                    insights.push(insight);
                }
            }
        }
    });

    // If we got too few insights, just split evenly
    if (insights.length < 2 && sentences.length > 0) {
        const step = Math.max(1, Math.floor(sentences.length / 3));
        insights.length = 0;
        for (let i = 0; i < sentences.length && insights.length < 5; i += step) {
            if (sentences[i].length < 150) {
                insights.push(sentences[i].trim());
            }
        }
    }

    // Ensure we have at least one insight
    if (insights.length === 0 && sentences.length > 0) {
        insights.push(sentences[0].trim());
    }

    return insights.length > 0 ? insights : [text.substring(0, 200) + '...'];
}

export default router;
