const {
  RefPerguruanTinggi,
  RefProgramStudi,
  RefMappingJurusanPtProdi,
} = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");
const { getFileUrl } = require("../../../common/middleware/upload_middleware");
const { Op } = require("sequelize");

exports.getPerguruanTinggiByPagination = async (req, res) => {
  try {
    // Ambil parameter page dan limit dari query, default ke 1 dan 10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const whereCondition = search
      ? {
          [Op.or]: [{ nama_pt: { [Op.like]: `%${search}%` } }],
        }
      : {};

    // Ambil data role + total count
    const { count, rows } = await RefPerguruanTinggi.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id_pt", "ASC"]],
    });

    return successResponse(res, "Data berhasil dimuat", {
      result: rows,
      total: count,
      current_page: page,
      total_pages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.log(error);
    return errorResponse("Internal Server Error");
  }
};

// Get semua perguruan tinggi
exports.getPerguruanTinggi = async (req, res) => {
  try {
    const perguruanTinggi = await RefPerguruanTinggi.findAll({
      order: [["id_pt", "ASC"]],
    });

    return successResponse(
      res,
      "Data perguruan tinggi berhasil dimuat",
      perguruanTinggi,
    );
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Get detail perguruan tinggi
exports.getDetailPerguruanTinggi = async (req, res) => {
  try {
    const { id } = req.params;

    const perguruanTinggi = await RefPerguruanTinggi.findOne({
      where: { id_pt: id },
    });

    if (!perguruanTinggi) {
      return errorResponse(res, "Data perguruan tinggi tidak ditemukan", 404);
    }

    // ubah ke object biasa
    const data = perguruanTinggi.toJSON();

    data.logo_asli = data.logo_path;

    // tambahkan logo_path full URL
    data.logo_path = data.logo_path
      ? getFileUrl(req, "logo_perguruan_tinggi", data.logo_path)
      : null;

    return successResponse(res, "Data perguruan tinggi berhasil dimuat", data);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.updatePerguruanTinggi = async (req, res) => {
  try {
    const { id } = req.params;

    const perguruanTinggi = await RefPerguruanTinggi.findOne({
      where: { id_pt: id },
    });

    if (!perguruanTinggi) {
      return errorResponse(res, "Perguruan tinggi tidak ditemukan", 404);
    }

    const {
      nama_pt,
      singkatan,
      alamat,
      jenis,
      no_telepon_pt,
      fax_pt,
      no_telepon_pimpinan,
      kota,
      kode_pos,
      email,
      website,
      nama_pimpinan,
      jabatan_pimpinan,
      no_rekening,
      nama_bank,
      nama_penerima_transfer,
      npwp,
      status_aktif,
      kode_pt,
      nama_operator,
      no_telepon_operator,
      email_operator,
      nama_verifikator,
      no_telepon_verifikator,
      email_verifikator,
    } = req.body;

    const payload = {
      nama_pt,
      kode_pt,
      singkatan,
      alamat,
      jenis,
      no_telepon_pt,
      fax_pt,
      no_telepon_pimpinan,
      kota,
      kode_pos,
      email,
      website,
      nama_pimpinan,
      jabatan_pimpinan,
      no_rekening,
      nama_bank,
      nama_penerima_transfer,
      npwp,
      status_aktif,
      nama_operator,
      no_telepon_operator,
      email_operator,
      nama_verifikator,
      no_telepon_verifikator,
      email_verifikator,
    };

    // hapus field undefined biar ga overwrite data lama
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key],
    );

    // jika upload logo baru
    if (req.file) {
      payload.logo_path = req.file.filename; // atau req.file.path
    }

    await perguruanTinggi.update(payload);

    return successResponse(res, "Perguruan tinggi berhasil diperbarui");
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Get program studi by ID perguruan tinggi
exports.getProgramStudiByPerguruanTinggi = async (req, res) => {
  try {
    const { idPerguruanTinggi } = req.params;

    const { kondisi_buta_warna } = req.params;

    const programStudi = await RefProgramStudi.findAll({
      where: { id_pt: idPerguruanTinggi },
      order: [["id_prodi", "ASC"]],
    });

    return successResponse(
      res,
      "Data program studi berhasil dimuat",
      programStudi,
    );
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

// Get semua perguruan tinggi sesuai dengan jurusan sekolah
exports.getPerguruanTinggiByJurusanSekolah = async (req, res) => {
  try {
    const { id_jurusan_sekolah } = req.params;

    const perguruanTinggi = await RefPerguruanTinggi.findAll({
      attributes: ["id_pt", "nama_pt", "singkatan", "jenis", "kota"],
      include: [
        {
          model: RefMappingJurusanPtProdi,
          as: "mappingJurusan",
          attributes: [],
          where: {
            id_jurusan_sekolah,
          },
        },
      ],
      group: ["RefPerguruanTinggi.id_pt"],
      order: [["id_pt", "ASC"]],
      raw: true, // 🔥 hasil FLAT
    });

    return successResponse(
      res,
      "Data perguruan tinggi berhasil dimuat",
      perguruanTinggi,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

// Get semua program studi sesuai dengan jurusan sekolah dan juga perguruan tinggi
exports.getProgramStudiByJurusanSekolahDanPerguruanTinggi = async (
  req,
  res,
) => {
  try {
    const { id_jurusan_sekolah, id_perguruan_tinggi } = req.params;

    const programStudi = await RefProgramStudi.findAll({
      attributes: [
        "id_prodi",
        "nama_prodi",
        "jenjang",
        "kuota",
        "boleh_buta_warna",
      ],
      where: {
        id_pt: id_perguruan_tinggi,
      },
      include: [
        {
          model: RefMappingJurusanPtProdi,
          as: "mappingJurusan",
          attributes: [],
          where: {
            id_jurusan_sekolah,
          },
        },
      ],
      order: [["nama_prodi", "ASC"]],
      group: ["RefProgramStudi.id_prodi"],
      raw: true,
    });

    return successResponse(
      res,
      "Data program studi berhasil dimuat",
      programStudi,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

// Get semua perguruan tinggi yang memiliki pengajuan perubahan
exports.getPerguruanTinggiHasPerubahan = async (req, res) => {
  try {
    const perguruanTinggi = await RefPerguruanTinggi.findAll({
      where: { has_pengajuan_perubahan: 1 },
      order: [["id_pt", "ASC"]],
    });

    return successResponse(
      res,
      "Data perguruan tinggi berhasil dimuat",
      perguruanTinggi,
    );
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.postPerguruanTinggiHasPerubahan = async (req, res) => {
  try {
    const { id_pt } = req.body;

    await RefPerguruanTinggi.update(
      { has_pengajuan_perubahan: 1 },
      { where: { id_pt: id_pt } },
    );

    return successResponse(res, "Data perguruan tinggi berhasil di-update");
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.updatePerguruanTinggiPengajuan = async (req, res) => {
  try {
    const { id } = req.params;

    const perguruanTinggi = await RefPerguruanTinggi.findOne({
      where: { id_pt: id },
    });

    if (!perguruanTinggi) {
      return errorResponse(res, "Perguruan tinggi tidak ditemukan", 404);
    }

    const {
      nama_pt,
      singkatan,
      alamat,
      jenis,
      no_telepon_pt,
      fax_pt,
      no_telepon_pimpinan,
      kota,
      kode_pos,
      email,
      website,
      nama_pimpinan,
      jabatan_pimpinan,
      no_rekening,
      nama_bank,
      nama_penerima_transfer,
      npwp,
      status_aktif,
      kode_pt,
      nama_operator,
      no_telepon_operator,
      email_operator,
      nama_verifikator,
      no_telepon_verifikator,
      email_verifikator,
    } = req.body;

    let logo_path;

    if (req.file) {
      logo_path = req.file.filename;
    }

    const payload = {
      nama_pt,
      kode_pt,
      singkatan,
      alamat,
      jenis,
      no_telepon_pt,
      fax_pt,
      no_telepon_pimpinan,
      kota,
      kode_pos,
      email,
      website,
      nama_pimpinan,
      jabatan_pimpinan,
      no_rekening,
      nama_bank,
      nama_penerima_transfer,
      npwp,
      status_aktif,
      nama_operator,
      no_telepon_operator,
      email_operator,
      nama_verifikator,
      no_telepon_verifikator,
      email_verifikator,
      has_pengajuan_perubahan: 0,
    };

    if (logo_path) {
      payload.logo_path = logo_path;
    }

    // hapus field undefined biar ga overwrite data lama
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key],
    );

    await perguruanTinggi.update(payload);

    return successResponse(res, "Perguruan tinggi berhasil diperbarui");
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};
