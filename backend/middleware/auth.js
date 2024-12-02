const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 获取 token
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // 检查 token 是否存在
  if (!token) {
    return res.status(401).json({ message: "无访问权限，请先登录" });
  }

  try {
    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 从 decoded.user 中获取用户信息
    req.user = decoded.user;
    console.log("Authenticated user:", req.user); // 添加日志
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Token 无效，请重新登录" });
  }
};
