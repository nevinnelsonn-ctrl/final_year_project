// Central error handler: use as app.use(errorHandler) after all routes
function errorHandler(err, req, res, next) {
  console.error('Error:', err.message || err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    message: status >= 500 ? 'Server error' : message,
    ...(process.env.NODE_ENV !== 'production' && status === 500 && { detail: err.message }),
  });
}

module.exports = errorHandler;
