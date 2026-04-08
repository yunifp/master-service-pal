const express = require("express");
const router = express.Router();

const {
  getNpsnByPagination,
  getNpsnById,
  createNpsn,
  updateNpsnById,
  deleteNpsn,
  getRefJenjang
} = require("../controller");

router.get("/", getNpsnByPagination);
router.get("/:id", getNpsnById);
router.post("/", createNpsn);
router.put("/:id", updateNpsnById);
router.delete("/:id", deleteNpsn);
router.get("/ref-jenjang", getRefJenjang);

module.exports = router;
