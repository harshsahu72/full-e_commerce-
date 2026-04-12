const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Apple AirPods Pro 2nd Gen',
    description: 'Active Noise Cancellation, Transparency Mode, Adaptive EQ, six hours of listening time.',
    price: 18999,
    originalPrice: 24999,
    category: 'Electronics',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
    stock: 25,
    rating: 4.8,
    numReviews: 124,
    featured: true,
    tags: ['wireless', 'earbuds', 'apple']
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: '200MP camera, S-Pen included, 5000mAh battery, Snapdragon 8 Gen 3.',
    price: 89999,
    originalPrice: 99999,
    category: 'Electronics',
    brand: 'Samsung',
    image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600&q=80',
    stock: 12,
    rating: 4.7,
    numReviews: 89,
    featured: true,
    tags: ['smartphone', 'samsung', '5g']
  },
  {
    name: 'Nike Air Max 270',
    description: 'Lightweight cushioning, breathable mesh upper, iconic Air Max heel unit.',
    price: 8995,
    originalPrice: 11995,
    category: 'Clothing',
    brand: 'Nike',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    stock: 50,
    rating: 4.5,
    numReviews: 210,
    featured: true,
    tags: ['shoes', 'sneakers', 'nike']
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation, 30hr battery, premium sound quality.',
    price: 24990,
    originalPrice: 34990,
    category: 'Electronics',
    brand: 'Sony',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    stock: 18,
    rating: 4.9,
    numReviews: 312,
    featured: true,
    tags: ['headphones', 'wireless', 'noise-cancelling']
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'Classic straight fit, button fly, 100% cotton denim, iconic since 1873.',
    price: 3999,
    originalPrice: 5999,
    category: 'Clothing',
    brand: "Levi's",
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
    stock: 75,
    rating: 4.4,
    numReviews: 98,
    featured: false,
    tags: ['jeans', 'denim', 'casual']
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.',
    price: 349,
    originalPrice: 499,
    category: 'Books',
    brand: 'Harriman House',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
    stock: 100,
    rating: 4.8,
    numReviews: 445,
    featured: true,
    tags: ['finance', 'self-help', 'bestseller']
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Laser detects dust, HEPA filtration, 60 min battery life.',
    price: 44900,
    originalPrice: 54900,
    category: 'Home & Garden',
    brand: 'Dyson',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    stock: 8,
    rating: 4.7,
    numReviews: 67,
    featured: true,
    tags: ['vacuum', 'cordless', 'dyson']
  },
  {
    name: 'Yoga Mat Premium Non-Slip',
    description: 'Extra thick 6mm, eco-friendly TPE material, carrying strap included.',
    price: 1299,
    originalPrice: 1999,
    category: 'Sports',
    brand: 'FitLife',
    image: 'https://images.unsplash.com/photo-1601925228088-c50b4d61a8e3?w=600&q=80',
    stock: 60,
    rating: 4.3,
    numReviews: 155,
    featured: false,
    tags: ['yoga', 'fitness', 'exercise']
  }
];

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products seeded successfully!');
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = { seedProducts };
