const express = require("express");
const router = express.Router();
const controller = require("../controller");

router.get("/paginate", controller.getDokumenUmumPaginated);
router.post("/", controller.createDokumenUmum);
router.put("/:id", controller.updateDokumenUmum);
router.delete("/:id", controller.deleteDokumenUmum);

router.get("/ref-dokumen-umum", controller.getRefDokumenUmum);

module.exports = router;