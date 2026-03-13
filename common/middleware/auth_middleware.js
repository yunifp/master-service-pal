const checkAuthorization = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization header missing" });
  }

  // Biasanya format Authorization: Bearer <token>
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Invalid token" });
  }

  next();
};

module.exports = checkAuthorization;
