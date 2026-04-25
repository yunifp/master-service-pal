const { Op } = require("sequelize");
const { RefNikCekal } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");

// ==========================================
// 1. GET ALL NIK CEKAL (PAGINATED & SEARCH)
// ==========================================
exports.getNikCekalPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const whereCondition = search
      ? {
          [Op.or]: [
            { nik: { [Op.like]: `%${search}%` } },
            { nama: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await RefNikCekal.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "DESC"]], // Urutkan data terbaru di atas
    });

    return successResponse(res, "Data NIK Cekal berhasil dimuat", {
      result: rows,
      total: count,
      current_page: page,
      total_pages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error getNikCekalPaginated:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 2. GET DETAIL NIK CEKAL BY ID
// ==========================================
exports.getNikCekalById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await RefNikCekal.findByPk(id);

    if (!data) return errorResponse(res, "Data NIK Cekal tidak ditemukan", 404);

    return successResponse(res, "Data NIK Cekal berhasil dimuat", data);
  } catch (error) {
    console.error("Error getNikCekalById:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 3. CREATE NIK CEKAL BARU
// ==========================================
exports.createNikCekal = async (req, res) => {
  try {
    const { nik, nama, keterangan } = req.body;

    if (!nik) return errorResponse(res, "NIK wajib diisi", 400);

    // Cek apakah NIK sudah dicekal sebelumnya
    const checkExist = await RefNikCekal.findOne({ where: { nik } });
    if (checkExist) return errorResponse(res, "NIK ini sudah masuk dalam daftar cekal", 400);

    const newData = await RefNikCekal.create({
      nik,
      nama: nama || null,
      keterangan: keterangan || null,
      created_at: new Date(),
    });

    return successResponse(res, "Berhasil menambahkan data NIK Cekal", newData, 201);
  } catch (error) {
    console.error("Error createNikCekal:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 4. UPDATE / EDIT NIK CEKAL
// ==========================================
exports.updateNikCekal = async (req, res) => {
  try {
    const { id } = req.params;
    const { nik, nama, keterangan } = req.body;

    const data = await RefNikCekal.findByPk(id);
    if (!data) return errorResponse(res, "Data NIK Cekal tidak ditemukan", 404);

    // Validasi duplikasi NIK jika NIK diubah
    if (nik && nik !== data.nik) {
      const checkExist = await RefNikCekal.findOne({ where: { nik } });
      if (checkExist) return errorResponse(res, "NIK tersebut sudah ada di daftar cekal lain", 400);
    }

    await data.update({
      nik: nik || data.nik,
      nama: nama !== undefined ? nama : data.nama,
      keterangan: keterangan !== undefined ? keterangan : data.keterangan,
      updated_at: new Date(),
    });

    return successResponse(res, "Berhasil memperbarui data NIK Cekal");
  } catch (error) {
    console.error("Error updateNikCekal:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ==========================================
// 5. DELETE / HAPUS NIK CEKAL
// ==========================================
exports.deleteNikCekal = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await RefNikCekal.findByPk(id);
    if (!data) return errorResponse(res, "Data NIK Cekal tidak ditemukan", 404);

    await data.destroy();

    return successResponse(res, "Berhasil menghapus data NIK Cekal");
  } catch (error) {
    console.error("Error deleteNikCekal:", error);
    return errorResponse(res, "Internal Server Error");
  }
};