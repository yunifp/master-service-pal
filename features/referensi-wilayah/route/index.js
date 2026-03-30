const express = require("express");
const router = express.Router();
const {
  getProvinsiPaginated,
  getKabKotaPaginated,
  getKecamatanPaginated,
  updateWilayah,
  deleteWilayah,
} = require("../controller");

// Endpoint untuk list data dengan pagination & filter
router.get("/provinsi/paginate", getProvinsiPaginated);
router.get("/kabkota/paginate", getKabKotaPaginated);
router.get("/kecamatan/paginate", getKecamatanPaginated);

// Endpoint untuk Edit dan Hapus (Menggunakan wilayah_id)
router.put("/:id", updateWilayah);
router.delete("/:id", deleteWilayah);

module.exports = router;