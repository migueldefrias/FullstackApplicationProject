const Product = require('../models/Product');
const sequelize = require('.');

const products = [
  { name: 'Notebook Dell', description: 'Notebook 15" Intel i5', price: 3500.00, stock: 10 },
  { name: 'Mouse Logitech', description: 'Mouse sem fio', price: 120.00, stock: 50 },
  { name: 'Teclado Mecânico', description: 'Teclado RGB', price: 250.00, stock: 20 },
  { name: 'Monitor LG', description: 'Monitor 24" Full HD', price: 900.00, stock: 15 },
  { name: 'Headset HyperX', description: 'Headset gamer', price: 400.00, stock: 30 },
];

(async () => {
  try {
    await sequelize.sync();
    await Product.bulkCreate(products);
    console.log('Seed concluído: 5 produtos criados.');
    process.exit(0);
  } catch (err) {
    console.error('Erro no seed:', err);
    process.exit(1);
  }
})(); 