const router = require('express').Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const SITE = 'https://souk-smart.com';

router.get('/produits/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let product = await Product.findOne({ slug: identifier }).populate('category');
    if (!product && mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findById(identifier).populate('category');
    }
    if (!product) {
      return res.status(404).send('<html><body><h1>404 - Produit introuvable</h1></body></html>');
    }

    const slug = product.slug || product._id;
    const canonicalUrl = `${SITE}/produits/${slug}`;
    const title = `${product.name} — Smart Souk`;
    const descSuffix = '. Livraison Maroc 24-48h. Paiement livraison.';
    const descPrefix = `${product.name} — `;
    const descBudget = Math.max(30, 155 - descPrefix.length - descSuffix.length);
    const desc = descPrefix + product.description.slice(0, descBudget) + descSuffix;
    const categoryName = product.category?.name || '';

    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      sku: String(product._id),
      brand: { '@type': 'Brand', name: 'Smart Souk' },
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        price: product.price,
        priceCurrency: 'MAD',
        availability:
          product.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: 'Smart Souk' },
      },
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Produits', item: `${SITE}/produits` },
        { '@type': 'ListItem', position: 3, name: product.name, item: canonicalUrl },
      ],
    };

    const escape = (s) =>
      String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    res.set('Cache-Control', 'public, max-age=86400');
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(desc)}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${escape(canonicalUrl)}" />
  <meta property="og:type" content="product" />
  <meta property="og:title" content="${escape(title)}" />
  <meta property="og:description" content="${escape(desc)}" />
  <meta property="og:image" content="${escape(product.image)}" />
  <meta property="og:url" content="${escape(canonicalUrl)}" />
  <meta property="og:site_name" content="Smart Souk" />
  <meta property="og:locale" content="fr_MA" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escape(title)}" />
  <meta name="twitter:description" content="${escape(desc)}" />
  <meta name="twitter:image" content="${escape(product.image)}" />
  <script type="application/ld+json">${JSON.stringify(productSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <nav>
    <a href="${SITE}/">Accueil</a> /
    <a href="${SITE}/produits">Produits</a> /
    <span>${escape(product.name)}</span>
  </nav>
  <main>
    <article>
      <h1>${escape(product.name)}</h1>
      ${categoryName ? `<p><strong>Catégorie :</strong> ${escape(categoryName)}</p>` : ''}
      <img src="${escape(product.image)}" alt="${escape(product.name)}" />
      <p>${escape(product.description)}</p>
      <p><strong>Prix :</strong> ${product.price.toFixed(2)} MAD</p>
      <p><strong>Disponibilité :</strong> ${product.stock > 0 ? 'En stock' : 'Rupture de stock'}</p>
      <p><strong>Paiement :</strong> Cash à la livraison</p>
      <p><strong>Livraison :</strong> Partout au Maroc sous 24-48h</p>
      <a href="${escape(canonicalUrl)}">Voir ce produit sur Smart Souk</a>
    </article>
  </main>
</body>
</html>`);
  } catch (err) {
    res.status(500).send('<html><body><h1>Erreur serveur</h1></body></html>');
  }
});

module.exports = router;
