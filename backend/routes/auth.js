const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ message: 'Identifiants incorrects' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creates the first admin — disabled once one exists
router.post('/setup', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0)
      return res.status(400).json({ message: 'Un admin existe déjà' });
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'username et password requis' });
    const admin = new Admin({ username, password });
    await admin.save();
    res.json({ message: 'Admin créé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update username/email and/or password
router.patch('/profile', auth, async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    if (!currentPassword)
      return res.status(400).json({ message: 'Mot de passe actuel requis' });

    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: 'Admin introuvable' });

    if (!(await admin.comparePassword(currentPassword)))
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });

    if (username && username !== admin.username) {
      const taken = await Admin.findOne({ username });
      if (taken) return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà pris' });
      admin.username = username;
    }

    if (newPassword) {
      if (newPassword.length < 6)
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
      admin.password = newPassword;
    }

    await admin.save();
    res.json({ message: 'Profil mis à jour avec succès', username: admin.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
