const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth'); // El middleware de seguridad

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

// --- GET /api/videos/search?q=query ---
router.get('/search', auth, async (req, res) => {
    const { q } = req.query; 

    if (!q) {
        return res.status(400).json({ msg: 'El parámetro de búsqueda "q" es obligatorio.' });
    }

    try {
        const response = await axios.get(YOUTUBE_API_URL, {
            params: {
                part: 'snippet',
                q: q,
                key: YOUTUBE_API_KEY, 
                type: 'video',
                maxResults: 10 
            }
        });

        const videos = response.data.items.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnailUrl: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle
        }));

        res.json(videos);
    } catch (err) {
        console.error('Error al llamar a la API de YouTube:', err.message);
        res.status(500).json({ msg: 'Error al buscar videos en YouTube' });
    }
});

module.exports = router;