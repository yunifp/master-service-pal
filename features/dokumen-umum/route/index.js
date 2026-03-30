const express = require("express");
const router = express.Router();
const controller = require("../controller");

router.get("/paginate", controller.getDokumenUmumPaginated);
router.post("/", controller.createDokumenUmum);
router.put("/:id", controller.updateDokumenUmum);
router.delete("/:id", controller.deleteDokumenUmum);

module.exports = router;