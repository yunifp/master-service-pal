const express = require("express");
const router = express.Router();

const { getAll } = require("../controller");

router.get("/all", getAll);

module.exports = router;
