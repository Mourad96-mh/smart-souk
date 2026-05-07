require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));

// Dynamic sitemap
app.get('/sitemap.xml', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const Category = require('./models/Category');
    const SITE = 'https://souk-smart.com';
    const [products, categories] = await Promise.all([
      Product.find({}, 'slug updatedAt').lean(),
      Category.find({}, 'slug updatedAt').lean(),
    ]);
    const urls = [
      `<url><loc>${SITE}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
      `<url><loc>${SITE}/produits</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
      `<url><loc>${SITE}/contact</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
      ...products
        .filter((p) => p.slug)
        .map((p) => `<url><loc>${SITE}/produits/${p.slug}</loc><lastmod>${new Date(p.updatedAt).toISOString().split('T')[0]}</lastmod><priority>0.8</priority></url>`),
    ];
    res.set('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Erreur serveur' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
