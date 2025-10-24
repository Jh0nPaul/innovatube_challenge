const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Necesario para la comunicación Front-End/Back-End
require('dotenv').config();

const authRoutes = require('./routes/auth');


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

    // Montar Rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación
// app.use('/api/favorites', favoriteRoutes); // (Próximo paso)
// app.use('/api/videos', videoRoutes); // (Próximo paso)

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de InnovaTube funcionando.');
});

// Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});