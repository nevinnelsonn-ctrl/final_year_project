// Simple validation helper: returns 400 with first error message, or calls next()
function validate(rules) {
  return (req, res, next) => {
    const errors = [];
    for (const [field, checks] of Object.entries(rules)) {
      const value = req.body[field];
      for (const check of checks) {
        const msg = check(value, field);
        if (msg) {
          errors.push(msg);
          break;
        }
      }
    }
    if (errors.length) {
      return res.status(400).json({ message: errors[0] });
    }
    next();
  };
}

// Common checks
const isRequired = (value, field) =>
  value == null || String(value).trim() === '' ? `${field} is required` : null;
const minLength = (len) => (value, field) =>
  value != null && String(value).length < len ? `${field} must be at least ${len} characters` : null;
const isEmail = (value) =>
  value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email' : null;
const isNumber = (value, field) =>
  value != null && (Number.isNaN(Number(value)) || Number(value) < 0)
    ? `${field} must be a valid positive number`
    : null;
const minNumber = (min) => (value, field) =>
  value != null && Number(value) < min ? `${field} must be at least ${min}` : null;

module.exports = {
  validate,
  isRequired,
  minLength,
  isEmail,
  isNumber,
  minNumber,
};
