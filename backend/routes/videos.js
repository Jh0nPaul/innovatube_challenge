// routes/videos.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

router.get('/search', auth, async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.status(400).json({ msg: 'El parámetro de búsqueda "q" es obligatorio.' });

    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({ msg: 'YOUTUBE_API_KEY no está configurada en el backend.' });
    }

    const { data } = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'snippet',
        q,
        key: YOUTUBE_API_KEY,
        type: 'video',
        maxResults: 10,
        safeSearch: 'moderate',
        regionCode: 'MX',
      },
      timeout: 10000,
    });

    const items = Array.isArray(data?.items) ? data.items : [];
    const videos = items.map((item) => ({
      videoId: item?.id?.videoId,
      title: item?.snippet?.title,
      thumbnailUrl: item?.snippet?.thumbnails?.medium?.url || item?.snippet?.thumbnails?.default?.url,
      channelTitle: item?.snippet?.channelTitle,
    })).filter(v => !!v.videoId);

    return res.json(videos);
  } catch (err) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || err.message;
    console.error('YouTube error:', status, details);
    return res.status(status === 403 || status === 400 ? status : 502).json({
      msg: 'Error al consultar la API de YouTube',
      status,
      details,
    });
  }
});

module.exports = router;
