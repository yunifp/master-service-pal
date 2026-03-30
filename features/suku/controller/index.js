const { Op } = require("sequelize");
const { RefSuku } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");

exports.getSukuPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.nama_suku = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await RefSuku.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["id", "DESC"]],
    });

    return successResponse(res, "Berhasil memuat data Suku", {
      result: rows,
      total: count,
      current_page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.createSuku = async (req, res) => {
  try {
    const { nama_suku, is_active } = req.body;

    if (!nama_suku) return errorResponse(res, "Nama Suku wajib diisi", 400);

    const newSuku = await RefSuku.create({
      nama_suku,
      is_active: is_active || "Y",
      created_at: new Date(),
    });

    return successResponse(res, "Berhasil menambahkan data Suku", newSuku, 201);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.updateSuku = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_suku, is_active } = req.body;

    const suku = await RefSuku.findByPk(id);
    if (!suku) return errorResponse(res, "Data Suku tidak ditemukan", 404);

    await suku.update({
      nama_suku: nama_suku || suku.nama_suku,
      is_active: is_active || suku.is_active,
      updated_at: new Date(),
    });

    return successResponse(res, "Berhasil memperbarui data Suku");
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.deleteSuku = async (req, res) => {
  try {
    const { id } = req.params;

    const suku = await RefSuku.findByPk(id);
    if (!suku) return errorResponse(res, "Data Suku tidak ditemukan", 404);

    await suku.destroy();

    return successResponse(res, "Berhasil menghapus data Suku");
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};