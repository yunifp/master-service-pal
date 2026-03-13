const { successResponse, errorResponse } = require("../../../common/response");
const { RefLembagaPendidikan, RefJenjang } = require("../../../models");

// Get semua perguruan tinggi
exports.getLembagaPendidikan = async (req, res) => {
  try {
    const lembagaPendidikan = await RefLembagaPendidikan.findAll({
      order: [["id", "ASC"]],
    });

    return successResponse(
      res,
      "Data lembaga pendidikan berhasil dimuat",
      lembagaPendidikan,
    );
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.getJenjangKuliah = async (req, res) => {
  try {
    const jenjangKuliah = await RefJenjang.findAll({
      order: [["id", "ASC"]],
    });

    return successResponse(
      res,
      "Data lembaga pendidikan berhasil dimuat",
      jenjangKuliah,
    );
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};
