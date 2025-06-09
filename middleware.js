module.exports = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};


module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== '123456') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

const { ValidationError } = require('../utils/errors');

module.exports = (req, res, next) => {
  const { name, price, category } = req.body;
  if (!name || typeof price !== 'number' || !category) {
    return next(new ValidationError('Invalid product data'));
  }
  next();
};

