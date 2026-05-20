const jwt = require('jsonwebtoken');

const JWT_SECRET  = process.env.JWT_SECRET  || 'changeme_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

/**
 * Generate a signed JWT for a user object.
 * @param {{ id, email, name }} user
 * @returns {string} token
 */
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

module.exports = { generateToken, JWT_SECRET };
