const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ msg: 'Acceso denegado. Se requiere un token.' });
    }

    // obtiene el token sin el prefijo 'Bearer '
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'Formato de token inválido.' });
    }

    // Verificar el token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adjuntar el ID del usuario a la petición
        req.userId = decoded.userId; 

        next(); // Continuar
    } catch (e) {
        res.status(401).json({ msg: 'Token no válido o expirado.' });
    }
};