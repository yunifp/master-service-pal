const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controller");

// Route: GET /api/master/dashboard/stats
router.get("/stats", getDashboardStats);

module.exports = router;