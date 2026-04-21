const {
  RefSyaratUmumBeasiswa,
  RefJalur,
  RefSyaratKhususBeasiswa,
  RefBeasiswa,
  RefJenjangSekolah,
  RefAgama,
  RefSuku,
  RefNpsn
} = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");
const RefJurusanSekolah = require("../../../models/RefJurusanSekolah");
const { Op } = require("sequelize");

exports.getAllBeasiswa = async (req, res) => {
  try {
    const beasiswa = await RefBeasiswa.findAll();

    return successResponse(res, "Data beasiswa berhasil dimuat", beasiswa);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.getBeasiswaAktif = async (req, res) => {
  try {
    const beasiswa = await RefBeasiswa.findOne({
      where: { status_aktif: "Y" },
    });

    return successResponse(res, "Data beasiswa berhasil dimuat", beasiswa);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Get semua persyaratan umum beasiswa yang aktif
exports.getPersyaratanUmumAktifBeasiswa = async (req, res) => {
  try {
    const persyaratanUmum = await RefSyaratUmumBeasiswa.findAll({
      where: { status_aktif: "Y" },
      order: [["id", "ASC"]],
    });

    return successResponse(
      res,
      "Data persyaratan umum berhasil dimuat",
      persyaratanUmum,
    );
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Get semua jalur
exports.getJalur = async (req, res) => {
  try {
    const jalur = await RefJalur.findAll({
      order: [["id", "ASC"]],
    });

    return successResponse(res, "Data jalur berhasil dimuat", jalur);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Get semua persyaratan khusus beasiswa yang aktif dan sesuai dengan jalurnya
exports.getPersyaratanKhususAktifBeasiswaByJalur = async (req, res) => {
  try {
    const { idJalur } = req.params;

    const persyaratanUmum = await RefSyaratKhususBeasiswa.findAll({
      where: { status_aktif: "Y", id_jalur: idJalur },
      order: [["id", "ASC"]],
    });

    return successResponse(
      res,
      "Data persyaratan umum berhasil dimuat",
      persyaratanUmum,
    );
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Get semua jenjang sekolah
exports.getJenjangSekolah = async (req, res) => {
  try {
    const jalur = await RefJenjangSekolah.findAll({
      order: [["id", "ASC"]],
    });

    return successResponse(res, "Data jalur berhasil dimuat", jalur);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Get semua jurusan sekolah jenjang sekolah
exports.getJurusanSekolahByIdJenjang = async (req, res) => {
  try {
    const { id_jenjang_sekolah } = req.params;
    const jalur = await RefJurusanSekolah.findAll({
      where: { id_jenjang_sekolah: id_jenjang_sekolah },
      order: [["id_jurusan_sekolah", "ASC"]],
    });

    return successResponse(res, "Data jalur berhasil dimuat", jalur);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Tutup beasiswa
exports.tutupBeasiswa = async (req, res) => {
  try {
    const { idBeasiswa } = req.params;

    await RefBeasiswa.update(
      { status_aktif: "N" },
      { where: { id: idBeasiswa } },
    );

    return successResponse(res, "Beasiswa berhasil ditutup");
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Get semua agama yang aktif
exports.getAgama = async (req, res) => {
  try {
    // const { RefAgama } = require("../../../models");

    const agama = await RefAgama.findAll({
      where: { is_active: "Y" },
      order: [["id", "ASC"]],
    });

    return successResponse(res, "Data agama berhasil dimuat", agama);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Get semua suku yang aktif
exports.getSuku = async (req, res) => {
  try {
    // const { RefSuku } = require("../../../models");

    const suku = await RefSuku.findAll({
      where: { is_active: "Y" },
      order: [["nama_suku", "ASC"]],
    });

    return successResponse(res, "Data suku berhasil dimuat", suku);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Dropdown search sekolah (by nama atau NPSN)
exports.searchRefNpsn = async (req, res) => {
  try {
    const { search, provinsi, kabkot, jenjang } = req.query;

    const whereClause = {};

    // 🔎 Search nama sekolah / NPSN
    if (search && search.trim() !== "") {
      whereClause[Op.or] = [
        {
          sekolah: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          npsn: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }


    if (jenjang) {
      whereClause.id_jenjang = jenjang;
    }

    const sekolah = await RefNpsn.findAll({
      where: whereClause,
      attributes: ["id", "sekolah", "npsn"],
      order: [["sekolah", "ASC"]],
      // limit: 20,
    });

    return successResponse(res, "Data sekolah berhasil dimuat", sekolah);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

// Tambahkan ke controller yang sama (beasiswaController.js atau refBeasiswaController.js)

// Get semua flow/status beasiswa
exports.getFlowBeasiswa = async (req, res) => {
  try {
    const { RefFlowBeasiswa } = require("../../../models");

    const baseCondition = {
      [Op.or]: [{ id: 2 }, { id: 5 }, { id: 3 }, { id: 17 }],
    };

    const flow = await RefFlowBeasiswa.findAll({
      where: baseCondition,
      order: [["id", "ASC"]],
    });

    return successResponse(res, "Data flow beasiswa berhasil dimuat", flow);
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};
