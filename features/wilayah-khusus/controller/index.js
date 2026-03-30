const { Op } = require("sequelize");
const { RefWilayah } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");

// ==========================================
// 1. GET KABUPATEN/KOTA (Untuk Tabel Wilayah Khusus)
// ==========================================
exports.getWilayahKhususPaginated = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", kode_pro, is_khusus } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Filter hanya Kab/Kota
    const where = { tingkat_label: { [Op.in]: ["kabupaten", "kota"] } };

    // Pencarian berdasarkan nama Kab/Kota
    if (search) {
      where.nama_wilayah = { [Op.like]: `%${search}%` };
    }

    // Filter berdasarkan Provinsi
    if (kode_pro) {
      where.kode_pro = kode_pro;
    }

    // Filter opsional: jika hanya ingin menampilkan yang sudah di-set 'Khusus'
    if (is_khusus === 'true') {
      where[Op.or] = [
        { wilayah_3t: '1' },
        { wilayah_perbatasan: '1' },
        { wilayah_papua_nusateng: '1' }
      ];
    }

    const { count, rows } = await RefWilayah.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [["kode_pro", "ASC"], ["nama_wilayah", "ASC"]],
      raw: true
    });

    // Ambil data Provinsi untuk me-mapping nama provinsi pada tabel
    const provinsiData = await RefWilayah.findAll({
      where: { tingkat_label: "provinsi" },
      raw: true
    });

    // Buat dictionary/map { kode_pro: nama_provinsi }
    const provMap = {};
    provinsiData.forEach(p => {
      provMap[p.kode_pro] = p.nama_wilayah;
    });

    // Format Data Response
    const result = rows.map(row => {
      // Ingat, nilainya sekarang string '1' atau '0' dari DB
      const is3T = row.wilayah_3t === '1';
      const isPerbatasan = row.wilayah_perbatasan === '1';
      const isPapuaNusra = row.wilayah_papua_nusateng === '1';
      
      // Logika Wilayah Khusus = Jika minimal 1 terceklis
      const isKhusus = is3T || isPerbatasan || isPapuaNusra;

      return {
        wilayah_id: row.wilayah_id,
        kode_pro: row.kode_pro,
        nama_provinsi: provMap[row.kode_pro] || "-",
        kode_kab: row.kode_kab,
        nama_kabkota: row.nama_wilayah,
        // Sesuaikan key balikan ke frontend dengan nama field baru
        wilayah_3t: is3T,
        wilayah_perbatasan: isPerbatasan,
        wilayah_papua_nusateng: isPapuaNusra,
        is_khusus: isKhusus // Ini hanya field virtual untuk di Frontend
      };
    });

    return successResponse(res, "Berhasil memuat data Wilayah Khusus", {
      result,
      total: count,
      current_page: parseInt(page),
      total_pages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    console.error("Error getWilayahKhususPaginated:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 2. EDIT/UPDATE STATUS WILAYAH KHUSUS
// ==========================================
exports.updateWilayahKhusus = async (req, res) => {
  try {
    const { id } = req.params;
    // Ambil payload dari frontend menggunakan nama field yang baru
    const { wilayah_3t, wilayah_perbatasan, wilayah_papua_nusateng } = req.body;

    const wilayah = await RefWilayah.findByPk(id);
    if (!wilayah) return errorResponse(res, "Data Wilayah tidak ditemukan", 404);

    await wilayah.update({
      // Ubah boolean dari FE jadi string '1' atau '0' untuk ENUM DB
      wilayah_3t: wilayah_3t ? '1' : '0',
      wilayah_perbatasan: wilayah_perbatasan ? '1' : '0',
      wilayah_papua_nusateng: wilayah_papua_nusateng ? '1' : '0',
    });

    return successResponse(res, "Berhasil memperbarui status Wilayah Khusus");
  } catch (error) {
    console.error("Error updateWilayahKhusus:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 3. DELETE (RESET STATUS KE DEFAULT)
// ==========================================
exports.deleteWilayahKhusus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const wilayah = await RefWilayah.findByPk(id);
    if (!wilayah) return errorResponse(res, "Data Wilayah tidak ditemukan", 404);

    // Aksi "Hapus" pada menu ini akan me-reset statusnya menjadi tidak khusus (string '0')
    await wilayah.update({
      wilayah_3t: '0',
      wilayah_perbatasan: '0',
      wilayah_papua_nusateng: '0',
    });

    return successResponse(res, "Berhasil mereset data Wilayah Khusus");
  } catch (error) {
    console.error("Error deleteWilayahKhusus:", error);
    return errorResponse(res, "Internal Server Error");
  }
};