require('dotenv').config();
const express = require('express');

const app = express();

console.log('🚀 Starting B4You API...');

// Middleware básico
app.use(express.json());

// CORS simples
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Inicializar banco
let sequelize, Product, dbConnected = false;
try {
  sequelize = require('./database');
  Product = require('./models/Product');
  
  sequelize.authenticate()
    .then(() => {
      console.log('✅ Database connected');
      dbConnected = true;
      return sequelize.sync();
    })
    .then(() => console.log('✅ Database synced'))
    .catch(err => {
      console.error('❌ DB Error:', err.message);
      dbConnected = false;
    });
} catch (error) {
  console.error('❌ Database init failed:', error.message);
  dbConnected = false;
}

// Rotas básicas
app.get('/', (req, res) => {
  res.json({ message: 'B4You API', status: 'OK' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Login simples
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@b4you.dev' && password === '123456') {
    res.json({ 
      token: 'temp_token_' + Date.now(),
      user: { email },
      message: 'Login successful'
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// CRUD Produtos
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock)
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Erro ao criar produto' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Erro ao buscar produto' });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
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
    
    res.json(product);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    await product.destroy();
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Erro ao deletar produto' });
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
});
