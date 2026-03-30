const { Op } = require("sequelize");
const { RefPekerjaan } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");

// ==========================================
// 1. GET ALL PEKERJAAN (PAGINATED & SEARCH)
// ==========================================
exports.getPekerjaanPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", is_active } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (search) {
      where.nama_pekerjaan = { [Op.like]: `%${search}%` };
    }

    if (is_active) {
      where.is_active = is_active;
    }

    const { count, rows } = await RefPekerjaan.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["id", "ASC"]], 
    });

    return successResponse(res, "Berhasil memuat data Pekerjaan", {
      result: rows,
      total: count,
      current_page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error("Error getPekerjaanPaginated:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 2. CREATE PEKERJAAN BARU
// ==========================================
exports.createPekerjaan = async (req, res) => {
  try {
    const { nama_pekerjaan, is_active = "Y" } = req.body;

    if (!nama_pekerjaan) return errorResponse(res, "Nama pekerjaan wajib diisi", 400);

    const newPekerjaan = await RefPekerjaan.create({ 
        nama_pekerjaan,
        is_active,
        created_at: new Date()
    });

    return successResponse(res, "Berhasil menambahkan data Pekerjaan", newPekerjaan, 201);
  } catch (error) {
    console.error("Error createPekerjaan:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 3. UPDATE / EDIT PEKERJAAN
// ==========================================
exports.updatePekerjaan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_pekerjaan, is_active } = req.body;

    const pekerjaan = await RefPekerjaan.findByPk(id);
    if (!pekerjaan) return errorResponse(res, "Data Pekerjaan tidak ditemukan", 404);

    await pekerjaan.update({ 
        nama_pekerjaan: nama_pekerjaan !== undefined ? nama_pekerjaan : pekerjaan.nama_pekerjaan,
        is_active: is_active !== undefined ? is_active : pekerjaan.is_active,
        updated_at: new Date()
    });

    return successResponse(res, "Berhasil memperbarui data Pekerjaan");
  } catch (error) {
    console.error("Error updatePekerjaan:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 4. DELETE / HAPUS PEKERJAAN
// ==========================================
exports.deletePekerjaan = async (req, res) => {
  try {
    const { id } = req.params;

    const pekerjaan = await RefPekerjaan.findByPk(id);
    if (!pekerjaan) return errorResponse(res, "Data Pekerjaan tidak ditemukan", 404);

    // Hard delete
    await pekerjaan.destroy();

    return successResponse(res, "Berhasil menghapus data Pekerjaan");
  } catch (error) {
    console.error("Error deletePekerjaan:", error);
    return errorResponse(res, "Internal Server Error");
  }
};