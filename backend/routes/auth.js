const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// --- POST /api/auth/register ---
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
        try {
                let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'El usuario ya existe.' });

    user = new User({ email, password });
    await user.save(); 

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, msg: 'Registro exitoso' });

    } catch (err) {
    res.status(500).send('Error al registrar usuario: ' + err.message);
        }
    });

// --- POST /api/auth/login ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
        try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email }, msg: 'Login exitoso' });

        } catch (err) {
            res.status(500).send('Error al iniciar sesión');
        }
    });

module.exports = router;