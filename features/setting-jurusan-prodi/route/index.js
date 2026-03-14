const express = require("express");
const router = express.Router();

const {
  getMappingJurusanProdi,
  toggleMappingProdi, 
  getAllJurusanSekolah
} = require("../controller");

router.get("/jurusan-sekolah/all", getAllJurusanSekolah);

router.get("/:id_jurusan_sekolah", getMappingJurusanProdi);
router.post("/toggle", toggleMappingProdi);

module.exports = router;