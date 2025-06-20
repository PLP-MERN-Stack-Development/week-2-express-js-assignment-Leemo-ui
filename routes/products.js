const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { validateProduct } = require('../middleware/validation');
const router = express.Router();

let products = [];

// Get all products with filtering and pagination
router.get('/', (req, res) => {
  let result = [...products];
  const { category, page = 1, limit = 10, search } = req.query;

  if (category) {
    result = result.filter(p => p.category === category);
  }

  if (search) {
    result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  res.json({
    total: result.length,
    page: parseInt(page),
    data: result.slice(startIndex, endIndex)
  });
});

// Other CRUD routes
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.post('/', validateProduct, (req, res) => {
  const product = { id: uuidv4(), ...req.body };
  products.push(product);
  res.status(201).json(product);
});

router.put('/:id', validateProduct, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

router.delete('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  products.splice(index, 1);
  res.status(204).send();
});

// Statistics route
router.get('/stats/categories', (req, res) => {
  const stats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  res.json(stats);
});

module.exports = router;
