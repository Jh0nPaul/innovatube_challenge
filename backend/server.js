const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const videoRoutes = require('./routes/videos');
const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorites');
require('dotenv').config();

const app = express();

// ==========================================
// CONFIGURACIÓN CORS - DEBE IR PRIMERO
// ==========================================
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir peticiones sin origin (mobile apps, postman, etc)
    if (!origin) return callback(null, true);
    
    // Permitir cualquier origin de github.dev
    if (origin.includes('github.dev')) {
      return callback(null, true);
    }
    
    // Permitir localhost
    if (origin.includes('localhost')) {
      return callback(null, true);
    }
    
    callback(null, true); // Permitir todo en desarrollo
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));

// Middleware adicional para headers CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  
  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});

// ==========================================
// OTROS MIDDLEWARES
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de peticiones
app.use((req, res, next) => {
  console.log(` ${req.method} ${req.path}`);
  next();
});

// ==========================================
// CONEXIÓN A BASE DE DATOS
// ==========================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Conectado a MongoDB Atlas.'))
  .catch(err => {
    console.error(' Error al conectar a MongoDB:', err);
    process.exit(1);
  });

// ==========================================
// RUTAS
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/search', videoRoutes.search);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de InnovaTube funcionando.',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message || 'Error interno del servidor' 
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(` Servidor backend escuchando en puerto ${PORT}`);
  console.log(` Accesible en: https://bug-free-lamp-9p7q696jxqph7qj7-${PORT}.app.github.dev`);
});