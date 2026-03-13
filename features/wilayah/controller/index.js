const { RefWilayah } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");

// Get semua provinsi
exports.getProvinsi = async (req, res) => {
  try {
    const provinsi = await RefWilayah.findAll({
      where: { tingkat: 1 },
      order: [["nama_wilayah", "ASC"]],
    });

    return successResponse(res, "Data provinsi berhasil dimuat", provinsi);
  } catch (error) {
    console.log(error);
    return errorResponse(res, "Internal Server Error");
  }
};

// Get kabupaten/kota berdasarkan kode provinsi
exports.getKabKotByProvinsi = async (req, res) => {
  try {
    const { kodeProv } = req.params;

    const kabkot = await RefWilayah.findAll({
      where: {
        kode_pro: kodeProv,
        tingkat: 2,
      },
      order: [["nama_wilayah", "ASC"]],
    });

    return successResponse(res, "Data kabupaten/kota berhasil dimuat", kabkot);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Get kecamatan berdasarkan kode kabupaten/kota
exports.getKecamatanByKabKot = async (req, res) => {
  try {
    const { kodeKabKot } = req.params;

    const kecamatan = await RefWilayah.findAll({
      where: {
        kode_kab: kodeKabKot,
        tingkat: 3,
      },
      order: [["nama_wilayah", "ASC"]],
    });

    return successResponse(res, "Data kecamatan berhasil dimuat", kecamatan);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Get kelurahan berdasarkan kode kecamatan
exports.getKelurahanByKecamatan = async (req, res) => {
  try {
    const { kodeKecamatan } = req.params;

    const kelurahan = await RefWilayah.findAll({
      where: {
        kode_kec: kodeKecamatan,
        tingkat: 4,
      },
      order: [["nama_wilayah", "ASC"]],
    });

    return successResponse(res, "Data kelurahan berhasil dimuat", kelurahan);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};
