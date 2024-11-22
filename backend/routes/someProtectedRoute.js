const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// 需要登录才能访问的路由
router.get("/dashboard", auth, async (req, res) => {
  try {
    // req.user 中包含了用户信息
    res.json({ message: "Protected route accessed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
