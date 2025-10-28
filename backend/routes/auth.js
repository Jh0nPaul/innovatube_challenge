const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register  
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Faltan campos.' });

   
    if (!firstName || !lastName || !username) {
     
      // return res.status(400).json({ msg: 'Faltan nombres/apellido/usuario.' });
    }

    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (existing) return res.status(400).json({ msg: 'El usuario ya existe.' });

    const user = new User({
      firstName: firstName || '',
      lastName: lastName || '',
      username: username || email.split('@')[0], // fallback
      email: email.toLowerCase(),
      password
    });
    await user.save();

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, username: user.username }, msg: 'Registro exitoso' });
  } catch (err) {
    res.status(500).send('Error al registrar usuario: ' + err.message);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    // admite email o username
    const { emailOrUsername, email, password } = req.body;
    const loginKey = (emailOrUsername || email || '').toLowerCase();

    const user = await User.findOne({
      $or: [{ email: loginKey }, { username: emailOrUsername }]
    });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email, username: user.username }, msg: 'Login exitoso' });
  } catch (err) {
    res.status(500).send('Error al iniciar sesión');
  }
});

// 🔹 POST /api/auth/forgot-password
// Recibe { email } o { emailOrUsername }, genera token temporal y lo guarda en el user.
router.post('/forgot-password', async (req, res) => {
  try {
    const emailOrUsername = (req.body.emailOrUsername || req.body.email || '').toLowerCase();
    if (!emailOrUsername) return res.status(400).json({ msg: 'Email o username requerido.' });

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: req.body.emailOrUsername }]
    });
    if (!user) return res.json({ msg: 'Si el email/usuario existe, enviaremos instrucciones.' });

    const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    user.resetPasswordToken = token;
    user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // En producción: se envía email con link.
    // Para DEV se devuelve el link para que pruebes:
    const resetLink = `http://localhost:4200/reset-password?token=${encodeURIComponent(token)}`;
    return res.json({ msg: 'Revisa tu correo para continuar.', devResetLink: resetLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al solicitar restablecimiento.' });
  }
});

// 🔹 POST /api/auth/reset-password
// Recibe { token, newPassword } y actualiza la contraseña si el token es válido y vigente.
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ msg: 'Faltan datos.' });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ msg: 'Token inválido o expirado.' });
    }

    const user = await User.findOne({ _id: payload.uid, resetPasswordToken: token });
    if (!user) return res.status(400).json({ msg: 'Token inválido.' });
    if (!user.resetPasswordExpiresAt || user.resetPasswordExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ msg: 'Token expirado.' });
    }

    user.password = newPassword; // se hashea en pre('save')
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    return res.json({ msg: 'Contraseña actualizada. Ya puedes iniciar sesión.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al restablecer contraseña.' });
  }
});

// (Opcional) POST /api/auth/logout - stateless: el FE borra el token
router.post('/logout', (req, res) => res.json({ msg: 'OK' }));

module.exports = router;
