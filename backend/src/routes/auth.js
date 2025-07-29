const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@b4you.dev' && password === '123456') {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Credenciais inválidas.' });
});

module.exports = router; 