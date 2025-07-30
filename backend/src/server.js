const express = require('express');
const app = express();

console.log('🚀 Starting server...');

// Middleware básico
app.use(express.json());

// CORS básico
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Log todas as requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas super simples
app.get('/', (req, res) => {
  console.log('📍 Root route accessed');
  res.json({ message: 'B4You API - Ultra Simple' });
});

app.get('/health', (req, res) => {
  console.log('🩺 Health check');
  res.json({ status: 'OK' });
});

// Login sem JWT por enquanto
app.post('/auth/login', (req, res) => {
  console.log('� Login attempt:', req.body);
  const { email, password } = req.body;
  
  if (email === 'admin@b4you.dev' && password === '123456') {
    console.log('✅ Login ok');
    return res.json({ 
      message: 'Login successful',
      user: { email }
    });
  }
  
  console.log('❌ Login failed');
  return res.status(401).json({ message: 'Invalid credentials' });
});

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor SIMPLIFICADO rodando em ${HOST}:${PORT}`);
}); 