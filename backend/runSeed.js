require('dotenv').config();
const mongoose = require('mongoose');
const { seedProducts } = require('./seeder');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding...');
    await seedProducts();
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
