function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "Internal server error" : err.message || "Request failed";

  if (res.headersSent) {
    return next(err);
  }

  return res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV !== "production" && { details: err.message }),
    },
  });
}

module.exports = errorHandler;
