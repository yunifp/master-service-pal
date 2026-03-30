const express = require("express");
const router = express.Router();
const {
  getPenghasilanPaginated,
  createPenghasilan,
  updatePenghasilan,
  deletePenghasilan,
} = require("../controller");

router.get("/paginate", getPenghasilanPaginated);
router.post("/", createPenghasilan);
router.put("/:id", updatePenghasilan);
router.delete("/:id", deletePenghasilan);

module.exports = router;