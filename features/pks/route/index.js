const express = require("express");
const router = express.Router();

const { getAllAlasanTidakAktif } = require("../controller");

router.get("/alasan-tidak-aktif", getAllAlasanTidakAktif);

module.exports = router;
