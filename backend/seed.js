require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  {
    name: 'Électronique & High-Tech',
    slug: 'electronique-high-tech',
    description: 'Smartphones, accessoires audio, chargeurs et gadgets du quotidien',
    order: 1,
  },
  {
    name: 'Maison & Cuisine',
    slug: 'maison-cuisine',
    description: 'Électroménager, ustensiles et tout ce qu\'il faut pour votre intérieur',
    order: 2,
  },
  {
    name: 'Mode & Accessoires',
    slug: 'mode-accessoires',
    description: 'Sacs, ceintures, montres et accessoires tendance pour homme et femme',
    order: 3,
  },
  {
    name: 'Sport & Bien-être',
    slug: 'sport-bien-etre',
    description: 'Équipements de fitness, yoga et accessoires pour rester en forme',
    order: 4,
  },
];

const products = (catMap) => [
  // ── Électronique & High-Tech ─────────────────────────────────────────────
  {
    name: 'Casque Bluetooth sans fil Pro',
    description:
      'Casque audio sans fil avec réduction de bruit active. Autonomie 30h, charge rapide USB-C (10 min = 3h). Confort premium avec coussinets en mousse à mémoire de forme. Compatible iOS et Android.',
    price: 349,
    category: catMap['electronique-high-tech'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    stock: 50,
    featured: true,
  },
  {
    name: 'Chargeur rapide USB-C 65W',
    description:
      'Chargeur compact GaN 65W avec port USB-C et USB-A. Compatible Power Delivery 3.0 et Quick Charge 4+. Charge un laptop, tablette et téléphone simultanément. Certifié CE, protection contre les surtensions.',
    price: 129,
    category: catMap['electronique-high-tech'],
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80',
    stock: 80,
    featured: false,
  },
  {
    name: 'Enceinte portable étanche',
    description:
      'Enceinte Bluetooth 360° résistante à l\'eau (IPX7). Autonomie 24h, portée 15 m. Son puissant avec basses profondes. Idéale pour la plage, le jardin ou les déplacements. Micro intégré pour les appels.',
    price: 259,
    category: catMap['electronique-high-tech'],
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    stock: 35,
    featured: true,
  },
  {
    name: 'Montre connectée Sport',
    description:
      'Smartwatch avec suivi de fréquence cardiaque, GPS intégré et 15 modes sportifs. Écran AMOLED 1.4", autonomie 7 jours. Notifications smartphone, suivi du sommeil et compteur de pas. Étanche 5 ATM.',
    price: 499,
    category: catMap['electronique-high-tech'],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    stock: 25,
    featured: true,
  },

  // ── Maison & Cuisine ─────────────────────────────────────────────────────
  {
    name: 'Blender multifonction 1200W',
    description:
      'Blender puissant 1200W avec bol en verre trempé 1,8 L. 6 lames en inox, 3 vitesses + pulse. Idéal pour smoothies, soupes, sauces et glaces. Socle antidérapant, facile à nettoyer. Garantie 2 ans.',
    price: 389,
    category: catMap['maison-cuisine'],
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80',
    stock: 30,
    featured: true,
  },
  {
    name: 'Set de couteaux de cuisine 5 pièces',
    description:
      'Coffret 5 couteaux de chef en acier inox X50CrMoV15. Inclus : couteau de chef 20 cm, couteau à pain, couteau d\'office, couteau à filet et éplucheur. Manches ergonomiques, tranchant durable. Bloc en bambou fourni.',
    price: 275,
    category: catMap['maison-cuisine'],
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&q=80',
    stock: 40,
    featured: false,
  },
  {
    name: 'Cafetière expresso automatique',
    description:
      'Machine à café entièrement automatique avec broyeur intégré. Pression 15 bars, chauffe en 40 secondes. Buse vapeur pour cappuccino et latte. Réservoir 1,8 L, bac à marc amovible. Compatible café en grains.',
    price: 1290,
    category: catMap['maison-cuisine'],
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    stock: 15,
    featured: true,
  },
  {
    name: 'Planche à découper en bambou XL',
    description:
      'Grande planche à découper en bambou naturel, 50×35×2 cm. Surface lisse et résistante aux entailles, antibactérienne. Rainure périmétrique pour retenir les jus. Légère et facile à entretenir. Certifiée sans BPA.',
    price: 95,
    category: catMap['maison-cuisine'],
    image: 'https://images.unsplash.com/photo-1495195129352-aeb325a55b65?w=600&q=80',
    stock: 60,
    featured: false,
  },

  // ── Mode & Accessoires ───────────────────────────────────────────────────
  {
    name: 'Sac à main en cuir véritable',
    description:
      'Sac à main élégant en cuir de vachette véritable. Compartiment principal zippé, deux poches intérieures et une poche extérieure. Bandoulière amovible et réglable. Disponible en noir et marron. Dimensions : 30×22×10 cm.',
    price: 420,
    category: catMap['mode-accessoires'],
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    stock: 20,
    featured: true,
  },
  {
    name: 'Montre analogique classique',
    description:
      'Montre-bracelet homme avec cadran en acier brossé, verre minéral traité anti-rayures. Mouvement quartz japonais de précision. Bracelet en cuir véritable, boucle ardillon. Étanchéité 3 ATM. Pile incluse.',
    price: 350,
    category: catMap['mode-accessoires'],
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
    stock: 30,
    featured: true,
  },
  {
    name: 'Ceinture en cuir pleine fleur',
    description:
      'Ceinture homme en cuir pleine fleur tanné végétalement. Largeur 3,5 cm, boucle en laiton massif. Disponible en tailles 85 à 115 cm. Coloris noir et cognac. Robuste et durable, s\'assouplit avec le temps.',
    price: 180,
    category: catMap['mode-accessoires'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    stock: 45,
    featured: false,
  },
  {
    name: 'Portefeuille slim en cuir',
    description:
      'Portefeuille fin en cuir de qualité avec 6 emplacements carte, 1 compartiment billet et 1 poche monnaie zippée. Protection RFID intégrée. Format slim, tient dans la poche avant. Disponible en 4 coloris.',
    price: 120,
    category: catMap['mode-accessoires'],
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
    stock: 55,
    featured: false,
  },

  // ── Sport & Bien-être ────────────────────────────────────────────────────
  {
    name: 'Tapis de yoga antidérapant 6 mm',
    description:
      'Tapis de yoga en TPE écologique, épaisseur 6 mm. Surface texturée antidérapante des deux côtés. Dimensions : 183×61 cm. Léger (900 g), avec sangle de transport. Résistant à l\'humidité, lavable à la main.',
    price: 159,
    category: catMap['sport-bien-etre'],
    image: 'https://images.unsplash.com/photo-1601925228870-6f4e5e5b0a47?w=600&q=80',
    stock: 40,
    featured: false,
  },
  {
    name: 'Set d\'haltères ajustables 20 kg',
    description:
      'Paire d\'haltères ajustables de 2 à 20 kg chacun par paliers de 2 kg. Remplacement des disques en 3 secondes grâce au système à cliquet. Poignée antidérapante en caoutchouc. Bac de rangement inclus. Idéal pour la musculation à domicile.',
    price: 890,
    category: catMap['sport-bien-etre'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    stock: 18,
    featured: true,
  },
  {
    name: 'Gourde isotherme inox 750 ml',
    description:
      'Gourde double paroi en acier inoxydable 18/8. Maintien chaud 12h, froid 24h. Bouchon à vis hermétique, sans BPA. Contenance 750 ml. Idéale pour le sport, le bureau ou les randonnées. Disponible en 5 couleurs.',
    price: 99,
    category: catMap['sport-bien-etre'],
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
    stock: 70,
    featured: true,
  },
  {
    name: 'Corde à sauter de compétition',
    description:
      'Corde à sauter speed rope avec câble acier gainé PVC Ø 3 mm. Roulements à billes haute vitesse pour rotation fluide. Poignées ergonomiques aluminium, longueur réglable jusqu\'à 3 m. Idéale pour le crossfit et la boxe.',
    price: 75,
    category: catMap['sport-bien-etre'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    stock: 65,
    featured: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    const created = await Category.insertMany(categories);
    const catMap = {};
    created.forEach((c) => (catMap[c.slug] = c._id));
    console.log('Categories:', Object.keys(catMap).join(', '));

    const list = products(catMap);
    await Product.insertMany(list);
    console.log(`Inserted ${list.length} products`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
