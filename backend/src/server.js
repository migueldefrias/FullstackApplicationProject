require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configurado para permitir frontend
const corsOptions = {
  origin: [
    'http://localhost:3000', // Desenvolvimento local
    'https://teste-tecnico-miguel-de-frias-b4-you.vercel.app', // Vercel (ajuste com sua URL)
    /\.vercel\.app$/ // Qualquer subdomínio do Vercel
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Health check route for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'B4You API is running',
    timestamp: new Date().toISOString()
  });
});

// Rotas serão adicionadas aqui

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 