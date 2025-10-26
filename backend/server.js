const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const videoRoutes = require('./routes/videos');
const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorites'); // <--- Asegúrate de importar

// Necesario para la comunicación Front-End/Back-End
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde el Frontend (http://localhost:4200)
app.use(express.json()); // Permite a Express leer el cuerpo de las peticiones JSON

// Conexión a la DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB Atlas.'))
    .catch(err => {
        console.error('Error al conectar a MongoDB. Revisa tu MONGO_URI en .env', err);
        process.exit(1);
    });

    // Monta Rutas
app.use('/api/auth', authRoutes); 
app.use('/api/favorites', favoriteRoutes);
app.use('/api/videos', videoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de InnovaTube funcionando.');
});

// Inicia Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});