const { Op } = require("sequelize");
const { RefSyaratKhususBeasiswa, RefJalur } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");

exports.getDokumenKhususPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (search) {
      const searchLower = search.toLowerCase();
      let statusSearch = search;
      
      // Menerjemahkan ketikan "YA" / "TIDAK" menjadi "Y" / "N" untuk kolom berjenis ENUM
      if (searchLower === 'ya') statusSearch = 'Y';
      if (searchLower === 'tidak') statusSearch = 'N';

      where[Op.or] = [
        { persyaratan: { [Op.like]: `%${search}%` } },
        { valid_type: { [Op.like]: `%${search}%` } },
        { '$jalur_ref.jalur$': { [Op.like]: `%${search}%` } },
        { status_aktif: { [Op.like]: `%${statusSearch}%` } },
        { is_required: { [Op.like]: `%${statusSearch}%` } },
        { is_kabkota: { [Op.like]: `%${statusSearch}%` } },
        { is_prov: { [Op.like]: `%${statusSearch}%` } }
      ];

      // Jika yang diketik adalah angka, ikut sertakan dalam pencarian Max Size
      if (!isNaN(search) && search.trim() !== "") {
        where[Op.or].push({ size: search });
      }
    }

    const { count, rows } = await RefSyaratKhususBeasiswa.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["id", "DESC"]],
      subQuery: false, // Wajib false agar relasi JOIN ($jalur_ref$) tidak error saat dipaginasi
      include: [
        {
          model: RefJalur,
          as: 'jalur_ref',
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
    const { id_jalur, persyaratan, status_aktif, valid_type, is_required, is_kabkota, is_prov, size, nama_file_unduh  } = req.body;

    if (!persyaratan) return errorResponse(res, "Nama Dokumen wajib diisi", 400);
    if (!id_jalur) return errorResponse(res, "Jalur wajib dipilih", 400);

    const newDokumen = await RefSyaratKhususBeasiswa.create({
      id_jalur,
      persyaratan,
      status_aktif: status_aktif || "Y",
      valid_type,
      is_required: is_required || "Y",
      is_kabkota: is_kabkota || "N",
      is_prov: is_prov || "N",
      size: size !== undefined ? size : null,
      nama_file_unduh: nama_file_unduh !== undefined ? nama_file_unduh : null,  
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
    const { id_jalur, persyaratan, status_aktif, valid_type, is_required, is_kabkota, is_prov, size, nama_file_unduh } = req.body;

    const dokumen = await RefSyaratKhususBeasiswa.findByPk(id);
    if (!dokumen) return errorResponse(res, "Data Dokumen Khusus tidak ditemukan", 404);

    await dokumen.update({
      id_jalur: id_jalur || dokumen.id_jalur,
      persyaratan: persyaratan || dokumen.persyaratan,
      status_aktif: status_aktif || dokumen.status_aktif,
      valid_type: valid_type !== undefined ? valid_type : dokumen.valid_type,
      is_required: is_required || dokumen.is_required,
      is_kabkota: is_kabkota || dokumen.is_kabkota,
      is_prov: is_prov || dokumen.is_prov,
      size: size !== undefined ? size : dokumen.size,
      nama_file_unduh: nama_file_unduh !== undefined ? nama_file_unduh : dokumen.nama_file_unduh,   
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

exports.getRefDokumenKhusus = async (req, res) => {
  try {
    const { is_kabkota, is_prov } = req.query;

    const where = {
      status_aktif: "Y",
    };

    if (is_kabkota) where.is_kabkota = is_kabkota;
    if (is_prov) where.is_prov = is_prov;

    const rows = await RefSyaratKhususBeasiswa.findAll({
      where,
      order: [["id", "ASC"]],
      include: [
        {
          model: RefJalur,
          as: "jalur_ref",
          attributes: ["id", "jalur"],
        },
      ],
    });

    return successResponse(res, "Berhasil memuat referensi Dokumen Khusus", {
      result: rows,
    });
  } catch (error) {
    console.error("Error getRefDokumenKhusus:", error);
    return errorResponse(res, "Internal Server Error");
  }
};