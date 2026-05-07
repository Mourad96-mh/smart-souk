const router = require('express').Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const populate = 'category';

router.get('/', async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const products = await Product.find(filter).populate(populate).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// One-time migration: generate slugs for all existing products
router.post('/migrate-slugs', auth, async (req, res) => {
  try {
    const products = await Product.find({ slug: { $in: [null, ''] } });
    let updated = 0;
    for (const p of products) {
      await p.save(); // pre-save hook generates slug
      updated++;
    }
    res.json({ message: `${updated} produits mis à jour` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get by slug or MongoDB id
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let product = await Product.findOne({ slug: identifier }).populate(populate);
    if (!product && mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findById(identifier).populate(populate);
    }
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    await product.populate(populate);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    Object.assign(product, req.body);
    await product.save();
    await product.populate(populate);
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
