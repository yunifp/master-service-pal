const { successResponse, errorResponse } = require("../../../common/response");
const { RefAlasanTidakAktif } = require("../../../models");

exports.getAllAlasanTidakAktif = async (req, res) => {
  try {
    const data = await RefAlasanTidakAktif.findAll();

    return successResponse(res, "Data berhasil dimuat", data);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};
