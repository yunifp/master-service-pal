const { Op } = require("sequelize");
const { RefAgama } = require("../../../models"); // Pastikan path ini sesuai
const { successResponse, errorResponse } = require("../../../common/response");

// ==========================================
// 1. GET ALL AGAMA (PAGINATED & SEARCH)
// ==========================================
exports.getAgamaPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", is_active } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    // Pencarian berdasarkan nama agama
    if (search) {
      where.nama_agama = { [Op.like]: `%${search}%` };
    }

    // Filter opsional kalau cuma mau nampilin yang aktif ("Y") atau non-aktif ("N")
    if (is_active) {
      where.is_active = is_active;
    }

    const { count, rows } = await RefAgama.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["id", "ASC"]], // Urutkan berdasarkan ID
    });

    return successResponse(res, "Berhasil memuat data Agama", {
      result: rows,
      total: count,
      current_page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error("Error getAgamaPaginated:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 2. CREATE AGAMA BARU
// ==========================================
exports.createAgama = async (req, res) => {
  try {
    const { nama_agama, is_active = "Y" } = req.body;

    if (!nama_agama) return errorResponse(res, "Nama agama wajib diisi", 400);

    const newAgama = await RefAgama.create({ 
        nama_agama,
        is_active,
        created_at: new Date()
    });

    return successResponse(res, "Berhasil menambahkan data Agama", newAgama, 201);
  } catch (error) {
    console.error("Error createAgama:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 3. UPDATE / EDIT AGAMA
// ==========================================
exports.updateAgama = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_agama, is_active } = req.body;

    const agama = await RefAgama.findByPk(id);
    if (!agama) return errorResponse(res, "Data Agama tidak ditemukan", 404);

    await agama.update({ 
        nama_agama: nama_agama !== undefined ? nama_agama : agama.nama_agama,
        is_active: is_active !== undefined ? is_active : agama.is_active,
        updated_at: new Date() // Catat waktu update
    });

    return successResponse(res, "Berhasil memperbarui data Agama");
  } catch (error) {
    console.error("Error updateAgama:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 4. DELETE / HAPUS AGAMA
// ==========================================
exports.deleteAgama = async (req, res) => {
  try {
    const { id } = req.params;

    const agama = await RefAgama.findByPk(id);
    if (!agama) return errorResponse(res, "Data Agama tidak ditemukan", 404);

    // OPSI 1: HARD DELETE (Beneran hilang dari database)
    await agama.destroy();

    // OPSI 2: SOFT DELETE (Cuma ubah status jadi non-aktif)
    // Kalau mau pakai ini, comment baris agama.destroy() di atas, dan uncomment baris di bawah:
    // await agama.update({ is_active: "N", updated_at: new Date() });

    return successResponse(res, "Berhasil menghapus data Agama");
  } catch (error) {
    console.error("Error deleteAgama:", error);
    return errorResponse(res, "Internal Server Error");
  }
};