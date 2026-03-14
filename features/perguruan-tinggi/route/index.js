const express = require("express");
const router = express.Router();

const {
  getPerguruanTinggi,
  getProgramStudiByPerguruanTinggi,
  getPerguruanTinggiByJurusanSekolah,
  getProgramStudiByJurusanSekolahDanPerguruanTinggi,
  getPerguruanTinggiByPagination,
  getDetailPerguruanTinggi,
  updatePerguruanTinggi,
  postPerguruanTinggiHasPerubahan,
  getPerguruanTinggiHasPerubahan,
  updatePerguruanTinggiPengajuan,
  createPerguruanTinggi, 
  deletePerguruanTinggi,
} = require("../controller");
const {
  uploadConfigs,
} = require("../../../common/middleware/upload_middleware");

router.get("/", getPerguruanTinggiByPagination);
router.get("/all", getPerguruanTinggi);
router.get(
  "/:idPerguruanTinggi/program-studi",
  getProgramStudiByPerguruanTinggi,
);
router.get(
  "/jurusan-sekolah/:id_jurusan_sekolah",
  getPerguruanTinggiByJurusanSekolah,
);
router.get(
  "/program-studi/:id_perguruan_tinggi/jurusan-sekolah/:id_jurusan_sekolah",
  getProgramStudiByJurusanSekolahDanPerguruanTinggi,
);

router.get("/has-perubahan", getPerguruanTinggiHasPerubahan);
router.post("/has-perubahan", postPerguruanTinggiHasPerubahan);

router.get("/:id", getDetailPerguruanTinggi);
router.put(
  "/:id",
  uploadConfigs.logo_perguruan_tinggi.single("logo"),
  updatePerguruanTinggi,
);

router.put(
  "/pengajuan/:id",
  uploadConfigs.logo_perguruan_tinggi.single("logo"),
  updatePerguruanTinggiPengajuan,
);

router.post("/", uploadConfigs.logo_perguruan_tinggi.single("logo"), createPerguruanTinggi);
router.delete("/:id", deletePerguruanTinggi);

module.exports = router;
