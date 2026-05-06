const express = require("express");
const router = express.Router();
const {
  getNikCekalPaginated,
  getNikCekalById,
  createNikCekal,
  updateNikCekal,
  deleteNikCekal,
  exportNikCekalExcel // ✅ Pastikan ini di-import
} = require("../controller");

// ✅ Route Export wajib di atas /:id
router.get("/export", exportNikCekalExcel);

// Ambil list NIK Cekal (mendukung parameter ?page=1&limit=10&search=)
router.get("/paginate", getNikCekalPaginated);

// Ambil detail NIK Cekal by ID
router.get("/:id", getNikCekalById);

// Tambah NIK Cekal baru
router.post("/", createNikCekal);

// Edit data NIK Cekal
router.put("/:id", updateNikCekal);

// Hapus data NIK Cekal
router.delete("/:id", deleteNikCekal);

module.exports = router;