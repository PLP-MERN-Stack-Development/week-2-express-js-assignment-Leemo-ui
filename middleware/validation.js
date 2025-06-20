function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({
      error: 'Missing required fields'
    });
  }

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({
      error: 'Price must be a positive number'
    });
  }

  if (typeof inStock !== 'boolean') {
    return res.status(400).json({
      error: 'inStock must be a boolean'
    });
  }

  next();
}

module.exports = { validateProduct };
