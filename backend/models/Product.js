const mongoose = require('mongoose');

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: '' },
    stock: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre('save', async function (next) {
  if (this.isModified('name') || !this.slug) {
    let base = slugify(this.name);
    let slug = base;
    let n = 1;
    while (await mongoose.model('Product').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${base}-${n++}`;
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
