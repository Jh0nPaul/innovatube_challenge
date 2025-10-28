const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;


const searchVideos = async (req, res) => {
    
    const q = String(req.query.q || '').trim();

     if (!q) {
      return res.status(400).json({ msg: 'Falta el parámetro de búsqueda (q).' });
    }

   
    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({ msg: 'YOUTUBE_API_KEY no está configurada en el backend.' });
    }

    const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

    try {
     const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        key: "AIzaSyApwy6SL_4nm8huJ3vyU4lJvvjBn5qqemA",
        q,
        part: 'snippet',
        type: 'video',
        maxResults: 10,
        safeSearch: 'moderate',
        regionCode: 'MX', 
      },
      timeout: 10000,
    });
     
    const items = Array.isArray(response?.data?.items) ? response.data.items : [];


     const videos = items.map((item) => ({
      videoId: item?.id?.videoId,
      title: item?.snippet?.title,
      description: item?.snippet?.description,
      channelTitle: item?.snippet?.channelTitle,
      // tu frontend usa "thumbnailUrl"
      thumbnailUrl: item?.snippet?.thumbnails?.medium?.url || item?.snippet?.thumbnails?.default?.url,
      // si luego quieres publishedAt, agrégalo al modelo del front
      // publishedAt: item?.snippet?.publishedAt,
    })).filter(v => !!v.videoId);

        return res.json(videos);

    } catch (error) {
      const status = error?.response?.status;
    const body = error?.response?.data;
    console.error('Error YouTube:', status, body || error.message);

    return res.status(502).json({
      msg: 'Error al consultar la API de YouTube',
      status: status || 500,
      error: typeof body === 'string' ? body.slice(0, 300) : body || String(error.message),
    });
    }
};

module.exports = {searchVideos};
