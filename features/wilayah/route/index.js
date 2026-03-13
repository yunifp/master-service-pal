const express = require("express");
const router = express.Router();

const {
  getProvinsi,
  getKabKotByProvinsi,
  getKecamatanByKabKot,
  getKelurahanByKecamatan,
} = require("../controller");

router.get("/provinsi", getProvinsi);
router.get("/kabkot/:kodeProv", getKabKotByProvinsi);
router.get("/kecamatan/:kodeKabKot", getKecamatanByKabKot);
router.get("/kelurahan/:kodeKecamatan", getKelurahanByKecamatan);

module.exports = router;
