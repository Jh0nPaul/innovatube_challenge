const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Favorite = require('../models/Favorites');

// --- GET /api/favorites ---
router.get('/', auth, async (req, res) => {
    try {
      
        const favorites = await Favorite.find({ userId: req.userId }).sort({ createdAt: -1 });

        res.json(favorites);
    } catch (err) {
        res.status(500).send('Error al obtener favoritos');
    }
});

// --- POST /api/favorites ---
router.post('/', auth, async (req, res) => {
    const { videoId, videoTitle, thumbnailUrl } = req.body;
    
    if (!videoId) return res.status(400).json({ msg: 'Falta el videoId' });

    try {
        const newFavorite = new Favorite({
            userId: req.userId, 
            videoId,
            videoTitle,
            thumbnailUrl
        });

        await newFavorite.save();
        res.status(201).json({ msg: 'Video agregado a favoritos', favorite: newFavorite });
        
    } catch (err) {
        // evita duplicados 
        if (err.code === 11000) { 
            return res.status(400).json({ msg: 'El video ya está en favoritos.' });
        }
        res.status(500).send('Error al agregar favorito');
    }
});

// --- DELETE /api/favorites/:videoId ---
router.delete('/:videoId', auth, async (req, res) => {
    try {
        const videoId = req.params.videoId;
        
        
        const result = await Favorite.deleteOne({ 
            userId: req.userId, 
            videoId: videoId 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Favorito no encontrado o ya eliminado.' });
        }

        res.json({ msg: 'Video eliminado de favoritos' });
    } catch (err) {
        res.status(500).send('Error al eliminar favorito');
    }
});

module.exports = router;