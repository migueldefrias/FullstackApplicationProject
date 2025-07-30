require('dotenv').config();
const express = require('express');

const app = express();

console.log('🚀 Starting server...');

// Inicializar banco de dados apenas se as variáveis estiverem configuradas
let sequelize, Product;
const hasDbConfig = process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER;

if (hasDbConfig) {
  console.log('�️ Database config found, initializing...');
  sequelize = require('./database');
  Product = require('./models/Product');
  
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
} else {
  console.log('⚠️ Database config not found, using mock data');
}

// Middleware básico
app.use(express.json());

// CORS melhorado
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://fullstack-application-project.vercel.app',
    'https://fullstackapplicationproject-production.up.railway.app'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
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
  res.json({ 
    message: 'B4You API',
    status: 'running',
    database: hasDbConfig ? 'configured' : 'mock',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  console.log('🩺 Health check');
  res.json({ 
    status: 'OK',
    database: hasDbConfig ? 'configured' : 'mock',
    environment: process.env.NODE_ENV || 'development'
  });
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

// Rota de produtos - com fallback para mock
app.get('/products', async (req, res) => {
  try {
    console.log('📦 Products list requested');
    
    if (hasDbConfig && Product) {
      console.log('📦 Fetching from database...');
      const products = await Product.findAll({
        order: [['createdAt', 'DESC']]
      });
      console.log(`📦 Found ${products.length} products from database`);
      res.json(products);
    } else {
      console.log('📦 Using mock data...');
      const mockProducts = [
        {
          id: 1,
          name: 'Produto Mock 1',
          description: 'Produto de exemplo enquanto banco não está configurado',
          price: 99.99,
          stock: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Produto Mock 2',
          description: 'Outro produto de exemplo',
          price: 149.99,
          stock: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      res.json(mockProducts);
    }
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
});

// Rota para criar produto - com fallback para mock
app.post('/products', async (req, res) => {
  try {
    console.log('📦 Creating product:', req.body);
    const { name, description, price, stock } = req.body;
    
    if (hasDbConfig && Product) {
      console.log('📦 Creating in database...');
      const product = await Product.create({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock)
      });
      console.log('📦 Product created with ID:', product.id);
      res.status(201).json(product);
    } else {
      console.log('📦 Simulating product creation...');
      const mockProduct = {
        id: Date.now(),
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('📦 Mock product created:', mockProduct.id);
      res.status(201).json(mockProduct);
    }
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
  }
});

// Rota para obter um produto específico
app.get('/products/:id', async (req, res) => {
  try {
    console.log('📦 Product detail requested for ID:', req.params.id);
    
    if (hasDbConfig && Product) {
      console.log('📦 Fetching from database...');
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      console.log('📦 Product found:', product.name);
      res.json(product);
    } else {
      console.log('📦 Using mock data...');
      const mockProduct = {
        id: parseInt(req.params.id),
        name: `Produto Mock ${req.params.id}`,
        description: 'Produto de exemplo enquanto banco não está configurado',
        price: 99.99,
        stock: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      res.json(mockProduct);
    }
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
  }
});

// Rota para atualizar produto
app.put('/products/:id', async (req, res) => {
  try {
    console.log('📦 Updating product ID:', req.params.id, 'with data:', req.body);
    const { name, description, price, stock } = req.body;
    
    if (hasDbConfig && Product) {
      console.log('📦 Updating in database...');
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      
      await product.update({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock)
      });
      
      console.log('📦 Product updated:', product.name);
      res.json(product);
    } else {
      console.log('📦 Simulating product update...');
      const mockProduct = {
        id: parseInt(req.params.id),
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('📦 Mock product updated:', mockProduct.id);
      res.json(mockProduct);
    }
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
  }
});

// Rota para deletar produto
app.delete('/products/:id', async (req, res) => {
  try {
    console.log('📦 Deleting product ID:', req.params.id);
    
    if (hasDbConfig && Product) {
      console.log('📦 Deleting from database...');
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      
      await product.destroy();
      console.log('📦 Product deleted from database');
      res.json({ message: 'Produto deletado com sucesso' });
    } else {
      console.log('📦 Simulating product deletion...');
      res.json({ message: 'Produto deletado com sucesso (simulado)' });
    }
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ message: 'Erro ao deletar produto', error: error.message });
  }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Configuração da porta - Railway injeta automaticamente
const PORT = process.env.PORT || 3000; // Seguindo o padrão do Railway
const HOST = '0.0.0.0'; // Sempre bind em 0.0.0.0

console.log(`🔧 Configurando servidor - HOST: ${HOST}, PORT: ${PORT}`);

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor RAILWAY rodando em ${HOST}:${PORT}`);
  console.log(`📍 Environment PORT: ${process.env.PORT || 'não definida'}`);
});
