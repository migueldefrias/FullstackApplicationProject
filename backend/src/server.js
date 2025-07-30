require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware de logging para debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// CORS mais simples
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rotas básicas apenas
app.get('/', (req, res) => {
  res.json({ 
    message: 'B4You API - Versão Simplificada',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rota de login diretamente no server (temporário)
app.post('/auth/login', (req, res) => {
  console.log('📧 Login attempt:', req.body);
  const { email, password } = req.body;
  
  if (email === 'admin@b4you.dev' && password === '123456') {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || 'temporary-secret',
      { expiresIn: '1h' }
    );
    console.log('✅ Login successful');
    return res.json({ token, user: { email } });
  }
  
  console.log('❌ Login failed');
  return res.status(401).json({ message: 'Credenciais inválidas.' });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor SIMPLIFICADO rodando em ${HOST}:${PORT}`);
}); 