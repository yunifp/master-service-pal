const {
  RefPerguruanTinggi,
  RefProgramStudi,
  RefMappingJurusanPtProdi,
} = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");
const { getFileUrl, deleteFile } = require("../../../common/middleware/upload_middleware");
const { Op } = require("sequelize");

exports.getPerguruanTinggiByPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const whereCondition = search
      ? {
        [Op.or]: [
          { nama_pt: { [Op.like]: `%${search}%` } },
          { singkatan: { [Op.like]: `%${search}%` } },
          { kota: { [Op.like]: `%${search}%` } },
          { kode_pt: { [Op.like]: `%${search}%` } }
        ],
      }
      : {};

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
    return errorResponse(res, "Internal Server Error");
  }
};

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

exports.getDetailPerguruanTinggi = async (req, res) => {
  try {
    const { id } = req.params;

    const perguruanTinggi = await RefPerguruanTinggi.findOne({
      where: { id_pt: id },
    });

    if (!perguruanTinggi) {
      return errorResponse(res, "Data perguruan tinggi tidak ditemukan", 404);
    }

    const data = perguruanTinggi.toJSON();
    data.logo_asli = data.logo_path;
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

    // Mendukung camelCase dari frontend maupun snake_case
    const {
      namaPerguruanTinggi, nama_pt,
      kodePerguruanTinggi, kode_pt,
      singkatan,
      alamat,
      jenis,
      noTeleponPt, no_telepon_pt,
      faxPt, fax_pt,
      kota,
      kodePos, kode_pos,
      alamatEmail, email,
      alamatWebsite, website,
      namaDirektur, nama_pimpinan,
      jabatanPimpinan, jabatan_pimpinan,
      noTeleponPimpinan, no_telepon_pimpinan,
      noRekeningLembaga, no_rekening,
      namaBank, nama_bank,
      namaPenerimaTransfer, nama_penerima_transfer,
      npwp,
      statusAktif, status_aktif
    } = req.body;

    const payload = {
      nama_pt: namaPerguruanTinggi || nama_pt,
      kode_pt: kodePerguruanTinggi || kode_pt,
      singkatan,
      alamat,
      jenis,
      no_telepon_pt: noTeleponPt || no_telepon_pt,
      fax_pt: faxPt || fax_pt,
      no_telepon_pimpinan: noTeleponPimpinan || no_telepon_pimpinan,
      kota,
      kode_pos: kodePos || kode_pos,
      email: alamatEmail || email,
      website: alamatWebsite || website,
      nama_pimpinan: namaDirektur || nama_pimpinan,
      jabatan_pimpinan: jabatanPimpinan || jabatan_pimpinan,
      no_rekening: noRekeningLembaga || no_rekening,
      nama_bank: namaBank || nama_bank,
      nama_penerima_transfer: namaPenerimaTransfer || nama_penerima_transfer,
      npwp,
      status_aktif: statusAktif !== undefined ? statusAktif : status_aktif,
    };

    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key],
    );

    if (req.file) {
      payload.logo_path = req.file.filename; 
    }

    await perguruanTinggi.update(payload);

    return successResponse(res, "Perguruan tinggi berhasil diperbarui");
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.getProgramStudiByPerguruanTinggi = async (req, res) => {
  try {
    const { idPerguruanTinggi } = req.params;

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
          where: { id_jurusan_sekolah },
        },
      ],
      group: ["RefPerguruanTinggi.id_pt"],
      order: [["id_pt", "ASC"]],
      raw: true,
    });

    const ptIds = perguruanTinggi.map((pt) => pt.id_pt);

    const prodiD1D2List = await RefProgramStudi.findAll({
      attributes: ["id_pt"],
      include: [
        {
          model: RefMappingJurusanPtProdi,
          as: "mappingJurusan",
          attributes: [],
          where: { id_jurusan_sekolah },
        },
      ],
      where: {
        id_pt: { [Op.in]: ptIds },
        jenjang: { [Op.in]: ["D1", "D2"] },
      },
      group: ["RefProgramStudi.id_pt"],
      raw: true,
    });

    const ptWithD1D2 = new Set(prodiD1D2List.map((p) => p.id_pt));

    const result = perguruanTinggi.map((pt) => ({
      ...pt,
      has_d1_d2: ptWithD1D2.has(pt.id_pt),
    }));

    return successResponse(res, "Data perguruan tinggi berhasil dimuat", result);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

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
      namaPerguruanTinggi, nama_pt,
      kodePerguruanTinggi, kode_pt,
      singkatan,
      alamat,
      jenis,
      noTeleponPt, no_telepon_pt,
      faxPt, fax_pt,
      kota,
      kodePos, kode_pos,
      alamatEmail, email,
      alamatWebsite, website,
      namaDirektur, nama_pimpinan,
      jabatanPimpinan, jabatan_pimpinan,
      noTeleponPimpinan, no_telepon_pimpinan,
      noRekeningLembaga, no_rekening,
      namaBank, nama_bank,
      namaPenerimaTransfer, nama_penerima_transfer,
      npwp,
      statusAktif, status_aktif
    } = req.body;

    const payload = {
      nama_pt: namaPerguruanTinggi || nama_pt,
      kode_pt: kodePerguruanTinggi || kode_pt,
      singkatan,
      alamat,
      jenis,
      no_telepon_pt: noTeleponPt || no_telepon_pt,
      fax_pt: faxPt || fax_pt,
      no_telepon_pimpinan: noTeleponPimpinan || no_telepon_pimpinan,
      kota,
      kode_pos: kodePos || kode_pos,
      email: alamatEmail || email,
      website: alamatWebsite || website,
      nama_pimpinan: namaDirektur || nama_pimpinan,
      jabatan_pimpinan: jabatanPimpinan || jabatan_pimpinan,
      no_rekening: noRekeningLembaga || no_rekening,
      nama_bank: namaBank || nama_bank,
      nama_penerima_transfer: namaPenerimaTransfer || nama_penerima_transfer,
      npwp,
      status_aktif: statusAktif !== undefined ? statusAktif : status_aktif,
      has_pengajuan_perubahan: 0,
    };

    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key],
    );

    if (req.file) {
      payload.logo_path = req.file.filename;
    }

    await perguruanTinggi.update(payload);

    return successResponse(res, "Perguruan tinggi berhasil diperbarui");
  } catch (error) {
    return errorResponse(res, "Internal Server Error");
  }
};

exports.createPerguruanTinggi = async (req, res) => {
  try {
    const {
      namaPerguruanTinggi, nama_pt,
      kodePerguruanTinggi, kode_pt,
      singkatan,
      alamat,
      jenis,
      noTeleponPt, no_telepon_pt,
      faxPt, fax_pt,
      kota,
      kodePos, kode_pos,
      alamatEmail, email,
      alamatWebsite, website,
      namaDirektur, nama_pimpinan,
      jabatanPimpinan, jabatan_pimpinan,
      noTeleponPimpinan, no_telepon_pimpinan,
      noRekeningLembaga, no_rekening,
      namaBank, nama_bank,
      namaPenerimaTransfer, nama_penerima_transfer,
      npwp,
      statusAktif, status_aktif
    } = req.body;

    const payload = {
      nama_pt: namaPerguruanTinggi || nama_pt,
      kode_pt: kodePerguruanTinggi || kode_pt,
      singkatan,
      alamat,
      jenis,
      no_telepon_pt: noTeleponPt || no_telepon_pt,
      fax_pt: faxPt || fax_pt,
      no_telepon_pimpinan: noTeleponPimpinan || no_telepon_pimpinan,
      kota,
      kode_pos: kodePos || kode_pos,
      email: alamatEmail || email,
      website: alamatWebsite || website,
      nama_pimpinan: namaDirektur || nama_pimpinan,
      jabatan_pimpinan: jabatanPimpinan || jabatan_pimpinan,
      no_rekening: noRekeningLembaga || no_rekening,
      nama_bank: namaBank || nama_bank,
      nama_penerima_transfer: namaPenerimaTransfer || nama_penerima_transfer,
      npwp,
      status_aktif: statusAktif !== undefined ? statusAktif : status_aktif,
      has_pengajuan_perubahan: 0,
    };

    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key],
    );

    if (req.file) {
      payload.logo_path = req.file.filename;
    }

    // Insert ke tabel Master
    const newPt = await RefPerguruanTinggi.create(payload);

    // Kirim kembalian object `newPt` agar Frontend bisa mengambil property `id_pt`
    return successResponse(res, "Perguruan tinggi berhasil ditambahkan", newPt, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.deletePerguruanTinggi = async (req, res) => {
  try {
    const { id } = req.params;

    const perguruanTinggi = await RefPerguruanTinggi.findOne({
      where: { id_pt: id },
    });

    if (!perguruanTinggi) {
      return errorResponse(res, "Perguruan tinggi tidak ditemukan", 404);
    }

    if (perguruanTinggi.logo_path) {
      deleteFile("logo_perguruan_tinggi", perguruanTinggi.logo_path);
    }

    await perguruanTinggi.destroy();

    return successResponse(res, "Perguruan tinggi berhasil dihapus");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};