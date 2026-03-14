const express = require("express");
const router = express.Router();

const {
  getProgramStudiByPtPagination,
  getDetailProgramStudi,
  createProgramStudi,
  updateProgramStudi,
  deleteProgramStudi,
  getAllProgramStudiPagination,
  updateKuotaButaWarna,
} = require("../controller");

router.get("/", getAllProgramStudiPagination);
router.get("/pt/:id_pt", getProgramStudiByPtPagination);
router.get("/:id_prodi", getDetailProgramStudi);
router.post("/", createProgramStudi); 
router.put("/:id_prodi", updateProgramStudi);
router.delete("/:id_prodi", deleteProgramStudi);
router.patch("/:id_prodi/setting-kuota", updateKuotaButaWarna);

module.exports = router;    