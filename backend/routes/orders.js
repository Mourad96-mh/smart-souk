const router = require('express').Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Commande supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/stats/summary', auth, async (req, res) => {
  try {
    const [total, pending, confirmed, delivered, revenueResult] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.aggregate([
        { $match: { status: { $in: ['confirmed', 'delivered'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);
    res.json({
      total,
      pending,
      confirmed,
      delivered,
      revenue: revenueResult[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
