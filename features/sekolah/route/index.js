const express = require("express");
const router = express.Router();

const {
  getJenjangSekolahByPagination,
  getJurusanSekolahByJenjangSekolahPagination,
} = require("../controller");

router.get("/jenjang-sekolah", getJenjangSekolahByPagination);
router.get(
  "/jenjang-sekolah/:id_jenjang_sekolah/jurusan-sekolah",
  getJurusanSekolahByJenjangSekolahPagination,
);

module.exports = router;
