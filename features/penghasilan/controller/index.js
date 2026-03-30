const { Op } = require("sequelize");
const { RefPenghasilan } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");

// ==========================================
// 1. GET ALL PENGHASILAN
// ==========================================
exports.getPenghasilanPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", is_active } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (search) {
      where.rentang_penghasilan = { [Op.like]: `%${search}%` };
    }

    if (is_active) {
      where.is_active = is_active;
    }

    const { count, rows } = await RefPenghasilan.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["id", "ASC"]], 
    });

    return successResponse(res, "Berhasil memuat data Penghasilan", {
      result: rows,
      total: count,
      current_page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error("Error getPenghasilanPaginated:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 2. CREATE PENGHASILAN
// ==========================================
exports.createPenghasilan = async (req, res) => {
  try {
    const { rentang_penghasilan, is_active = "Y" } = req.body;

    if (!rentang_penghasilan) return errorResponse(res, "Rentang penghasilan wajib diisi", 400);

    const newPenghasilan = await RefPenghasilan.create({ 
        rentang_penghasilan,
        is_active,
        created_at: new Date()
    });

    return successResponse(res, "Berhasil menambahkan data Penghasilan", newPenghasilan, 201);
  } catch (error) {
    console.error("Error createPenghasilan:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 3. UPDATE PENGHASILAN
// ==========================================
exports.updatePenghasilan = async (req, res) => {
  try {
    const { id } = req.params;
    const { rentang_penghasilan, is_active } = req.body;

    const penghasilan = await RefPenghasilan.findByPk(id);
    if (!penghasilan) return errorResponse(res, "Data Penghasilan tidak ditemukan", 404);

    await penghasilan.update({ 
        rentang_penghasilan: rentang_penghasilan !== undefined ? rentang_penghasilan : penghasilan.rentang_penghasilan,
        is_active: is_active !== undefined ? is_active : penghasilan.is_active,
        updated_at: new Date()
    });

    return successResponse(res, "Berhasil memperbarui data Penghasilan");
  } catch (error) {
    console.error("Error updatePenghasilan:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 4. DELETE PENGHASILAN
// ==========================================
exports.deletePenghasilan = async (req, res) => {
  try {
    const { id } = req.params;

    const penghasilan = await RefPenghasilan.findByPk(id);
    if (!penghasilan) return errorResponse(res, "Data Penghasilan tidak ditemukan", 404);

    await penghasilan.destroy();

    return successResponse(res, "Berhasil menghapus data Penghasilan");
  } catch (error) {
    console.error("Error deletePenghasilan:", error);
    return errorResponse(res, "Internal Server Error");
  }
};