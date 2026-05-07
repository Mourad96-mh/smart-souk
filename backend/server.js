require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const ALLOWED_ORIGINS = [
  'https://souk-smart.com',
  'https://www.souk-smart.com',
  'http://localhost:5173',
  'http://localhost:4173',
];
if (process.env.FRONTEND_URL) ALLOWED_ORIGINS.push(process.env.FRONTEND_URL);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
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
app.use('/prerender', require('./routes/prerender'));

// Dynamic sitemap
app.get('/sitemap.xml', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const Category = require('./models/Category');
    const SITE = 'https://souk-smart.com';
    const [products, categories] = await Promise.all([
      Product.find({}, 'slug updatedAt').lean(),
      Category.find({}, '_id slug updatedAt').lean(),
    ]);
    const urls = [
      `<url><loc>${SITE}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
      `<url><loc>${SITE}/produits</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
      `<url><loc>${SITE}/contact</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
      ...categories.map(
        (c) =>
          `<url><loc>${SITE}/produits?category=${c._id}</loc><lastmod>${new Date(c.updatedAt).toISOString().split('T')[0]}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
      ),
      ...products
        .filter((p) => p.slug)
        .map(
          (p) =>
            `<url><loc>${SITE}/produits/${p.slug}</loc><lastmod>${new Date(p.updatedAt).toISOString().split('T')[0]}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
        ),
    ];
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
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
