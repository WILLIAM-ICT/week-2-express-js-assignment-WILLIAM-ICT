const { v4: uuidv4 } = require('uuid');
const products = require('../data/products');
const { NotFoundError, ValidationError } = require('../utils/errors');

exports.getAllProducts = (req, res) => {
  const { category, page = 1, limit = 5, search } = req.query;
  let results = [...products];

  if (category) {
    results = results.filter(p => p.category === category);
  }

  if (search) {
    results = results.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  const start = (page - 1) * limit;
  const paginated = results.slice(start, start + Number(limit));

  res.json(paginated);
};

exports.getProductById = (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.json(product);
};

exports.createProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !price || !category) {
    return next(new ValidationError('Missing required fields'));
  }
  const newProduct = { id: uuidv4(), name, description, price, category, inStock };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

exports.updateProduct = (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
};

exports.deleteProduct = (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));

  products.splice(index, 1);
  res.status(204).send();
};

exports.getStats = (req, res) => {
  const stats = {};
  products.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  res.json(stats);
};
