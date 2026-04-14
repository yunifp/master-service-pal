const { Op } = require("sequelize");
const { RefSyaratKhususBeasiswa, RefJalur } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");

exports.getDokumenKhususPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.persyaratan = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await RefSyaratKhususBeasiswa.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["id", "DESC"]], // Urutkan data terbaru di atas
      include: [
        {
          model: RefJalur,
          as: 'jalur_ref', // Sesuai relasi di model lo
          attributes: ['id', 'jalur'],
        }
      ]
    });

    return successResponse(res, "Berhasil memuat data Dokumen Khusus", {
      result: rows,
      total: count,
      current_page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error getDokumenKhususPaginated:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.createDokumenKhusus = async (req, res) => {
  try {
    // Tambahkan is_kabkota dan is_prov
    const { id_jalur, persyaratan, status_aktif, valid_type, is_required, is_kabkota, is_prov } = req.body;

    if (!persyaratan) return errorResponse(res, "Nama Dokumen wajib diisi", 400);
    if (!id_jalur) return errorResponse(res, "Jalur wajib dipilih", 400);

    const newDokumen = await RefSyaratKhususBeasiswa.create({
      id_jalur,
      persyaratan,
      status_aktif: status_aktif || "Y",
      valid_type,
      is_required: is_required || "Y",
      is_kabkota: is_kabkota || "N", // Default N jika tidak dikirim
      is_prov: is_prov || "N",       // Default N jika tidak dikirim
      created_at: new Date(),
    });

    return successResponse(res, "Berhasil menambahkan data Dokumen Khusus", newDokumen, 201);
  } catch (error) {
    console.error("Error createDokumenKhusus:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.updateDokumenKhusus = async (req, res) => {
  try {
    const { id } = req.params;
    // Tambahkan is_kabkota dan is_prov
    const { id_jalur, persyaratan, status_aktif, valid_type, is_required, is_kabkota, is_prov } = req.body;

    const dokumen = await RefSyaratKhususBeasiswa.findByPk(id);
    if (!dokumen) return errorResponse(res, "Data Dokumen Khusus tidak ditemukan", 404);

    await dokumen.update({
      id_jalur: id_jalur || dokumen.id_jalur,
      persyaratan: persyaratan || dokumen.persyaratan,
      status_aktif: status_aktif || dokumen.status_aktif,
      valid_type: valid_type !== undefined ? valid_type : dokumen.valid_type,
      is_required: is_required || dokumen.is_required,
      is_kabkota: is_kabkota || dokumen.is_kabkota, // Update nilai jika ada
      is_prov: is_prov || dokumen.is_prov,          // Update nilai jika ada
      updated_at: new Date(),
    });

    return successResponse(res, "Berhasil memperbarui data Dokumen Khusus");
  } catch (error) {
    console.error("Error updateDokumenKhusus:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.deleteDokumenKhusus = async (req, res) => {
  try {
    const { id } = req.params;

    const dokumen = await RefSyaratKhususBeasiswa.findByPk(id);
    if (!dokumen) return errorResponse(res, "Data Dokumen Khusus tidak ditemukan", 404);

    await dokumen.destroy();

    return successResponse(res, "Berhasil menghapus data Dokumen Khusus");
  } catch (error) {
    console.error("Error deleteDokumenKhusus:", error);
    return errorResponse(res, "Internal Server Error");
  }
};