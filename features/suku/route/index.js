const express = require("express");
const router = express.Router();
const controller = require("../controller");

router.get("/paginate", controller.getSukuPaginated);
router.post("/", controller.createSuku);
router.put("/:id", controller.updateSuku);
router.delete("/:id", controller.deleteSuku);

module.exports = router;