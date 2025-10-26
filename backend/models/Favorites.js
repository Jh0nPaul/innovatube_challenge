const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    // Clave foránea al usuario
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    videoId: { 
        type: String, 
        required: true 
    },
    videoTitle: { 
        type: String 
    },
    thumbnailUrl: { 
        type: String 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Índice para asegurar que un usuario NO agregue el MISMO video dos veces
FavoriteSchema.index({ userId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);