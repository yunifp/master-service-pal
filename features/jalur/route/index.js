const express = require("express");
const router = express.Router();
const controller = require("../controller");

router.get("/paginate", controller.getJalurPaginated);
router.post("/", controller.createJalur);
router.put("/:id", controller.updateJalur);

router.delete("/:id", controller.deleteJalur);

module.exports = router;