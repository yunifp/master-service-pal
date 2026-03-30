const { Op } = require("sequelize");
const { RefWilayah } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");

// ==========================================
// 1. GET PROVINSI (Dengan Pagination & Search)
// ==========================================
exports.getProvinsiPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = { tingkat_label: "provinsi" };
    if (search) {
      where.nama_wilayah = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await RefWilayah.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["nama_wilayah", "ASC"]],
    });

    return successResponse(res, "Berhasil mengambil data Provinsi", {
      result: rows,
      total: count,
      current_page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error getProvinsiPaginated:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 2. GET KABUPATEN/KOTA (Dengan Pagination & Search)
// Bisa difilter berdasarkan kode_pro (saat provinsi di-klik)
// ==========================================
exports.getKabKotaPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", kode_pro } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = { tingkat_label: { [Op.in]: ["kabupaten", "kota"] } };
    
    // Pencarian nama Kab/Kota
    if (search) {
      where.nama_wilayah = { [Op.like]: `%${search}%` };
    }
    
    // Filter berdasarkan Provinsi yang di-klik
    if (kode_pro) {
      where.kode_pro = kode_pro;
    }

    const { count, rows } = await RefWilayah.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["nama_wilayah", "ASC"]],
    });

    return successResponse(res, "Berhasil mengambil data Kabupaten/Kota", {
      result: rows,
      total: count,
      current_page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error getKabKotaPaginated:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 3. GET KECAMATAN (Dengan Pagination & Search)
// Bisa difilter berdasarkan kode_kab (saat Kab/Kota di-klik)
// ==========================================
exports.getKecamatanPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", kode_kab } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = { tingkat_label: "kecamatan" };
    
    // Pencarian nama Kecamatan
    if (search) {
      where.nama_wilayah = { [Op.like]: `%${search}%` };
    }
    
    // Filter berdasarkan Kabupaten/Kota yang di-klik
    if (kode_kab) {
      where.kode_kab = kode_kab;
    }

    const { count, rows } = await RefWilayah.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["nama_wilayah", "ASC"]],
    });

    return successResponse(res, "Berhasil mengambil data Kecamatan", {
      result: rows,
      total: count,
      current_page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error getKecamatanPaginated:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 4. UPDATE WILAYAH
// ==========================================
exports.updateWilayah = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_wilayah, kode_pro, kode_kab, kode_kec } = req.body;

    const wilayah = await RefWilayah.findByPk(id);
    if (!wilayah) {
      return errorResponse(res, "Data Wilayah tidak ditemukan", 404);
    }

    await wilayah.update({
      nama_wilayah: nama_wilayah || wilayah.nama_wilayah,
      kode_pro: kode_pro !== undefined ? kode_pro : wilayah.kode_pro,
      kode_kab: kode_kab !== undefined ? kode_kab : wilayah.kode_kab,
      kode_kec: kode_kec !== undefined ? kode_kec : wilayah.kode_kec,
    });

    return successResponse(res, "Berhasil memperbarui data wilayah", wilayah);
  } catch (error) {
    console.error("Error updateWilayah:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 5. DELETE WILAYAH
// ==========================================
exports.deleteWilayah = async (req, res) => {
  try {
    const { id } = req.params;

    const wilayah = await RefWilayah.findByPk(id);
    if (!wilayah) {
      return errorResponse(res, "Data Wilayah tidak ditemukan", 404);
    }

    // Pastikan untuk tidak menghapus wilayah yang memiliki anak (children) jika diperlukan
    // Logika tambahan bisa ditaruh di sini

    await wilayah.destroy();

    return successResponse(res, "Berhasil menghapus data wilayah");
  } catch (error) {
    console.error("Error deleteWilayah:", error);
    return errorResponse(res, "Internal Server Error");
  }
};