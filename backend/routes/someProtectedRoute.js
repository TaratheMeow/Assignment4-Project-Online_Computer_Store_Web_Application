const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/dashboard", auth, async (req, res) => {
  try {
    res.json({ message: "Protected route accessed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
