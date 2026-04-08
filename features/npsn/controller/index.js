const { RefNpsn, RefJenjang } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");
const { Op } = require("sequelize");

// GET semua data jenjang dari ref_jenjang (untuk dropdown)
exports.getRefJenjang = async (req, res) => {
  try {
    const jenjangList = await RefJenjang.findAll({
      order: [["id_jenjang", "ASC"]],
    });
    return successResponse(res, "Data jenjang berhasil dimuat", jenjangList);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

// GET semua NPSN dengan pagination + search
exports.getNpsnByPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const whereCondition = search
      ? {
        [Op.or]: [
          { sekolah: { [Op.like]: `%${search}%` } },
          { npsn: { [Op.like]: `%${search}%` } },
        ],
      }
      : {};

    const { count, rows } = await RefNpsn.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    return successResponse(res, "Data NPSN berhasil dimuat", {
      result: rows,
      total: count,
      current_page: page,
      total_pages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

// GET detail NPSN by ID
exports.getNpsnById = async (req, res) => {
  try {
    const { id } = req.params;
    const npsn = await RefNpsn.findOne({ where: { id } });

    if (!npsn) {
      return errorResponse(res, "Data NPSN tidak ditemukan", 404);
    }

    return successResponse(res, "Data NPSN berhasil dimuat", npsn);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

// POST buat NPSN baru
exports.createNpsn = async (req, res) => {
  try {
    const { id_jenjang, sekolah, npsn, jenis_sekolah } = req.body;

    const newNpsn = await RefNpsn.create({
      id_jenjang,
      sekolah,
      npsn: npsn || null,
      jenis_sekolah: jenis_sekolah || null,
    });


    return successResponse(res, "Data NPSN berhasil ditambahkan", newNpsn, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

// PUT update NPSN by ID
exports.updateNpsnById = async (req, res) => {
  try {
    const { id } = req.params;
    const npsn = await RefNpsn.findOne({ where: { id } });

    if (!npsn) {
      return errorResponse(res, "Data NPSN tidak ditemukan", 404);
    }

    const { id_jenjang, sekolah, npsn: npsn_number, jenis_sekolah } = req.body;

    const payload = {
      id_jenjang,
      sekolah,
      npsn: npsn_number ?? null,
      jenis_sekolah: jenis_sekolah ?? null,
    };

    // Hapus field undefined agar tidak overwrite data lama
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    await npsn.update(payload);

    return successResponse(res, "Data NPSN berhasil diperbarui");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

// DELETE NPSN by ID
exports.deleteNpsn = async (req, res) => {
  try {
    const { id } = req.params;
    const npsn = await RefNpsn.findOne({ where: { id } });

    if (!npsn) {
      return errorResponse(res, "Data NPSN tidak ditemukan", 404);
    }

    await npsn.destroy();

    return successResponse(res, "Data NPSN berhasil dihapus");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};