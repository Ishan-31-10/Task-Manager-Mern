const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Email already in use",
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({ success: false, message: messages[0] });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid resource id" });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Server error"
        : err.message || "Server error",
  });
};

export default errorHandler;
