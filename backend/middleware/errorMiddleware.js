exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  res.status(statusCode).json({ message });
};
