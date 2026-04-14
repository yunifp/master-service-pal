const express = require("express");
const router = express.Router();

const {
  getMappingJurusanProdi,
  toggleMappingProdi, 
  getAllJurusanSekolah,
  getMappingProdiByPt,          // <-- Import baru
  getMappingJurusanByProdi
} = require("../controller");


router.get("/pt/:id_pt", getMappingProdiByPt);
router.get("/prodi/:id_prodi/jurusan", getMappingJurusanByProdi);
router.get("/jurusan-sekolah/all", getAllJurusanSekolah);

router.get("/:id_jurusan_sekolah", getMappingJurusanProdi);
router.post("/toggle", toggleMappingProdi);

module.exports = router;