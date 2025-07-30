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

// Endpoint para debug das configurações
app.get('/config', (req, res) => {
  console.log('⚙️ Config check');
  res.json({
    port: process.env.PORT || 'não definida',
    railway: {
      domain: process.env.RAILWAY_PUBLIC_DOMAIN || 'não definida',
      service: process.env.RAILWAY_SERVICE_NAME || 'não definida',
      environment: process.env.RAILWAY_ENVIRONMENT_NAME || 'não definida'
    },
    timestamp: new Date().toISOString()
  });
});

// Login com token temporário
app.post('/auth/login', (req, res) => {
  console.log('🔐 Login attempt:', req.body);
  const { email, password } = req.body;
  
  if (email === 'admin@b4you.dev' && password === '123456') {
    console.log('✅ Login ok');
    // Retorna um token temporário para compatibilidade
    const temporaryToken = 'temp_token_' + Date.now();
    return res.json({ 
      token: temporaryToken,
      user: { email },
      message: 'Login successful'
    });
  }
  
  console.log('❌ Login failed');
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Rota de produtos temporária
app.get('/products', (req, res) => {
  console.log('📦 Products list requested');
  // Produtos mock para teste
  const products = [
    {
      id: 1,
      name: 'Produto Teste 1',
      description: 'Descrição do produto 1',
      price: 99.99,
      category: 'Categoria A',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Produto Teste 2', 
      description: 'Descrição do produto 2',
      price: 149.99,
      category: 'Categoria B',
      createdAt: new Date().toISOString()
    }
  ];
  
  res.json(products);
});

// Configuração da porta - Railway injeta automaticamente
const PORT = process.env.PORT || 3000; // Seguindo o padrão do Railway
const HOST = '0.0.0.0'; // Sempre bind em 0.0.0.0

console.log(`🔧 Configurando servidor - HOST: ${HOST}, PORT: ${PORT}`);

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor RAILWAY rodando em ${HOST}:${PORT}`);
  console.log(`📍 Environment PORT: ${process.env.PORT || 'não definida'}`);
});
