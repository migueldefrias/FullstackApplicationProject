const sequelize = require('.');
const Product = require('../models/Product');

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Migration concluída: tabela products criada.');
    process.exit(0);
  } catch (err) {
    console.error('Erro na migration:', err);
    process.exit(1);
  }
})(); 