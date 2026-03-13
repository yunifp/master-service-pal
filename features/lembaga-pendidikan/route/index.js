const express = require("express");
const router = express.Router();

const { getLembagaPendidikan, getJenjangKuliah } = require("../controller");

router.get("/", getLembagaPendidikan);
router.get("/jenjang-kuliah", getJenjangKuliah);

module.exports = router;
