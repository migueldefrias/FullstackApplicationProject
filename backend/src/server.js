require('dotenv').config();
const express = require('express');
const sequelize = require('./database');
const Product = require('./models/Product');

const app = express();

console.log('🚀 Starting server...');

// Conectar ao banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('🗄️ Database connected successfully');
    return sequelize.sync();
  })
  .then(() => {
    console.log('📊 Database synced');
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });

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

// Rota de produtos - conectada ao banco
app.get('/products', async (req, res) => {
  try {
    console.log('📦 Products list requested from database');
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']]
    });
    console.log(`📦 Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
});

// Rota para criar novo produto - conectada ao banco
app.post('/products', async (req, res) => {
  try {
    console.log('📦 Create product request:', req.body);
    const { name, description, price, category, stock } = req.body;
    
    // Validação básica
    if (!name || !description || !price) {
      return res.status(400).json({ 
        message: 'Campos obrigatórios: name, description, price' 
      });
    }
    
    // Criar produto no banco
    const newProduct = await Product.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock) || 0
    });
    
    console.log('✅ Product created in database:', newProduct.toJSON());
    res.status(201).json(newProduct);
    
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({ 
      message: 'Erro ao criar produto', 
      error: error.message 
    });
  }
});

// Configuração da porta - Railway injeta automaticamente
const PORT = process.env.PORT || 3000; // Seguindo o padrão do Railway
const HOST = '0.0.0.0'; // Sempre bind em 0.0.0.0

console.log(`🔧 Configurando servidor - HOST: ${HOST}, PORT: ${PORT}`);

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor RAILWAY rodando em ${HOST}:${PORT}`);
  console.log(`📍 Environment PORT: ${process.env.PORT || 'não definida'}`);
});
