const { Op } = require("sequelize");
const { RefJalur } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");

exports.getJalurPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.jalur = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await RefJalur.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["id", "ASC"]],
    });

    return successResponse(res, "Berhasil memuat data Jalur", {
      result: rows,
      total: count,
      current_page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.createJalur = async (req, res) => {
  try {
    const { jalur } = req.body;

    if (!jalur) return errorResponse(res, "Nama jalur wajib diisi", 400);

    const newJalur = await RefJalur.create({
      jalur,
      created_at: new Date(),
    });

    return successResponse(res, "Berhasil menambahkan data Jalur", newJalur, 201);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.updateJalur = async (req, res) => {
  try {
    const { id } = req.params;
    const { jalur } = req.body;

    const dataJalur = await RefJalur.findByPk(id);
    if (!dataJalur) return errorResponse(res, "Data Jalur tidak ditemukan", 404);

    await dataJalur.update({
      jalur: jalur || dataJalur.jalur,
      updated_at: new Date(),
    });

    return successResponse(res, "Berhasil memperbarui data Jalur");
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.deleteJalur = async (req, res) => {
  try {
    const { id } = req.params;

    const dataJalur = await RefJalur.findByPk(id);
    if (!dataJalur) return errorResponse(res, "Data Jalur tidak ditemukan", 404);

    await dataJalur.destroy();

    return successResponse(res, "Berhasil menghapus data Jalur");
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};