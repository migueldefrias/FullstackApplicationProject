const express = require('express');
const { object, string, number } = require('yup');
const Product = require('../models/Product');
const auth = require('../middlewares/auth');

const router = express.Router();

const productSchema = object({
  name: string().required('Nome é obrigatório'),
  description: string().required('Descrição é obrigatória'),
  price: number().required('Preço é obrigatório').positive('Preço deve ser positivo'),
  stock: number().required('Estoque é obrigatório').integer('Estoque deve ser inteiro').min(0, 'Estoque não pode ser negativo'),
});

router.use(auth);

// Listar todos
router.get('/', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

// Obter um
router.get('/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Produto não encontrado.' });
  res.json(product);
});

// Criar
router.post('/', async (req, res) => {
  try {
    await productSchema.validate(req.body);
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.errors ? err.errors[0] : err.message });
  }
});

// Atualizar
router.put('/:id', async (req, res) => {
  try {
    await productSchema.validate(req.body);
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produto não encontrado.' });
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.errors ? err.errors[0] : err.message });
  }
});

// Deletar
router.delete('/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Produto não encontrado.' });
  await product.destroy();
  res.json({ message: 'Produto deletado com sucesso.' });
});

module.exports = router; 