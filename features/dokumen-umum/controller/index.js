const { Op } = require("sequelize");
const { RefSyaratUmumBeasiswa } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");

exports.getDokumenUmumPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.persyaratan = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await RefSyaratUmumBeasiswa.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["id", "ASC"]],
    });

    return successResponse(res, "Berhasil memuat data Dokumen Umum", {
      result: rows,
      total: count,
      current_page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.createDokumenUmum = async (req, res) => {
  try {
    const { persyaratan, status_aktif, valid_type, is_required } = req.body;

    if (!persyaratan) return errorResponse(res, "Nama Dokumen wajib diisi", 400);

    const newDokumen = await RefSyaratUmumBeasiswa.create({
      persyaratan,
      status_aktif: status_aktif || "Y",
      valid_type,
      is_required: is_required || "Y",
      created_at: new Date(),
    });

    return successResponse(res, "Berhasil menambahkan data Dokumen Umum", newDokumen, 201);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.updateDokumenUmum = async (req, res) => {
  try {
    const { id } = req.params;
    const { persyaratan, status_aktif, valid_type, is_required } = req.body;

    const dokumen = await RefSyaratUmumBeasiswa.findByPk(id);
    if (!dokumen) return errorResponse(res, "Data Dokumen Umum tidak ditemukan", 404);

    await dokumen.update({
      persyaratan: persyaratan || dokumen.persyaratan,
      status_aktif: status_aktif || dokumen.status_aktif,
      valid_type: valid_type || dokumen.valid_type,
      is_required: is_required || dokumen.is_required,
      updated_at: new Date(),
    });

    return successResponse(res, "Berhasil memperbarui data Dokumen Umum");
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.deleteDokumenUmum = async (req, res) => {
  try {
    const { id } = req.params;

    const dokumen = await RefSyaratUmumBeasiswa.findByPk(id);
    if (!dokumen) return errorResponse(res, "Data Dokumen Umum tidak ditemukan", 404);

    await dokumen.destroy();

    return successResponse(res, "Berhasil menghapus data Dokumen Umum");
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};