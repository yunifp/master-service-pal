const express = require("express");
const router = express.Router();
const {
  getPekerjaanPaginated,
  createPekerjaan,
  updatePekerjaan,
  deletePekerjaan,
} = require("../controller");

router.get("/paginate", getPekerjaanPaginated);
router.post("/", createPekerjaan);
router.put("/:id", updatePekerjaan);
router.delete("/:id", deletePekerjaan);

module.exports = router;