const express = require("express");
const router = express.Router();
const {
  getAgamaPaginated,
  createAgama,
  updateAgama,
  deleteAgama,
} = require("../controller");

// Ambil list agama
router.get("/paginate", getAgamaPaginated);

// Tambah agama baru
router.post("/", createAgama);

// Edit data agama
router.put("/:id", updateAgama);

// Hapus data agama
router.delete("/:id", deleteAgama);

module.exports = router;