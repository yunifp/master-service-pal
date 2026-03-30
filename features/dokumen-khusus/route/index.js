const express = require("express");
const router = express.Router();
const controller = require("../controller");

router.get("/paginate", controller.getDokumenKhususPaginated);
router.post("/", controller.createDokumenKhusus);
router.put("/:id", controller.updateDokumenKhusus);
router.delete("/:id", controller.deleteDokumenKhusus);

module.exports = router;