const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // get token
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // check if token exists
  if (!token) {
    return res.status(401).json({ message: "No access, please login" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // get user info from decoded.user
    req.user = decoded.user;
    console.log("Authenticated user:", req.user); // add log
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Invalid token, please login again" });
  }
};
