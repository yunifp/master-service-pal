const { RefBank } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");

// Get semua bank
exports.getAll = async (req, res) => {
  try {
    const bank = await RefBank.findAll({
      order: [["id", "ASC"]],
    });

    return successResponse(res, "Data bank berhasil dimuat", bank);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};
