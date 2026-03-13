const { Op } = require("sequelize");
const { RefJenjangSekolah } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");
const RefJurusanSekolah = require("../../../models/RefJurusanSekolah");

exports.getJenjangSekolahByPagination = async (req, res) => {
  try {
    // Ambil parameter page dan limit dari query, default ke 1 dan 10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const whereCondition = search
      ? {
          [Op.or]: [{ jenjang: { [Op.like]: `%${search}%` } }],
        }
      : {};

    // Ambil data role + total count
    const { count, rows } = await RefJenjangSekolah.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    return successResponse(res, "Data berhasil dimuat", {
      result: rows,
      total: count,
      current_page: page,
      total_pages: Math.ceil(count / limit),
    });
  } catch (error) {
    return errorResponse("Internal Server Error");
  }
};

exports.getJurusanSekolahByJenjangSekolahPagination = async (req, res) => {
  try {
    const { id_jenjang_sekolah } = req.params;

    // Ambil parameter page dan limit dari query, default ke 1 dan 10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    let whereCondition = {
      id_jenjang_sekolah,
    };

    if (search) {
      whereCondition[Op.or] = [
        {
          jurusan: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    // Ambil data role + total count
    const { count, rows } = await RefJurusanSekolah.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id_jurusan_sekolah", "ASC"]],
    });

    return successResponse(res, "Data berhasil dimuat", {
      result: rows,
      total: count,
      current_page: page,
      total_pages: Math.ceil(count / limit),
    });
  } catch (error) {
    return errorResponse("Internal Server Error");
  }
};
