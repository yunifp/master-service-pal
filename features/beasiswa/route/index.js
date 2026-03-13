const express = require("express");
const router = express.Router();

const {
  getPersyaratanUmumAktifBeasiswa,
  getJalur,
  getPersyaratanKhususAktifBeasiswaByJalur,
  getBeasiswaAktif,
  getAllBeasiswa,
  getJenjangSekolah,
  tutupBeasiswa,
  getJurusanSekolahByIdJenjang,
  getAgama,
  getSuku,
  searchRefNpsn,
  getFlowBeasiswa
} = require("../controller");

router.get("/all", getAllBeasiswa);
router.get("/beasiswa-aktif", getBeasiswaAktif);
router.put("/tutup/:idBeasiswa", tutupBeasiswa);
router.get("/persyaratan-umum-aktif", getPersyaratanUmumAktifBeasiswa);
router.get("/persyaratan-khusus-aktif/jalur/:idJalur", getPersyaratanKhususAktifBeasiswaByJalur);
router.get("/jalur", getJalur);
router.get("/jenjang-sekolah", getJenjangSekolah);
router.get("/jurusan-sekolah/jenjang/:id_jenjang_sekolah", getJurusanSekolahByIdJenjang);
router.get("/agama", getAgama);   // ✅ baru
router.get("/suku", getSuku);     // ✅ baru
router.get("/ref-npsn/search", searchRefNpsn);
router.get("/flow-beasiswa", getFlowBeasiswa);

module.exports = router;