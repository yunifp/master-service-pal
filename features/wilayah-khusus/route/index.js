const express = require("express");
const router = express.Router();
const {
  getWilayahKhususPaginated,
  updateWilayahKhusus,
  deleteWilayahKhusus,
} = require("../controller");

// Ambil list data (Bisa filter via ?search= & ?kode_pro=)
router.get("/paginate", getWilayahKhususPaginated);

// Edit status (Ubah centang)
router.put("/:id", updateWilayahKhusus);

// Hapus status (Reset menjadi - / false)
router.delete("/:id", deleteWilayahKhusus);

module.exports = router;