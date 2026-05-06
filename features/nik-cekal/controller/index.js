const { Op } = require("sequelize");
const { RefNikCekal } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");
const ExcelJS = require("exceljs"); // ✅ Pastikan library ini dipanggil

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
            { tahun: { [Op.like]: `%${search}%` } }, // ✅ Support filter tahun
          ],
        }
      : {};

    const { count, rows } = await RefNikCekal.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", "DESC"]], 
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
    const { nik, nama, tahun, keterangan, is_aktif } = req.body; // ✅ Support tahun & is_aktif

    if (!nik) return errorResponse(res, "NIK wajib diisi", 400);

    const checkExist = await RefNikCekal.findOne({ where: { nik } });
    if (checkExist) return errorResponse(res, "NIK ini sudah masuk dalam daftar cekal", 400);

    const newData = await RefNikCekal.create({
      nik,
      nama: nama || null,
      tahun: tahun || new Date().getFullYear().toString(),
      keterangan: keterangan || null,
      is_aktif: is_aktif || "Y",
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
    const { nik, nama, tahun, keterangan, is_aktif } = req.body;

    const data = await RefNikCekal.findByPk(id);
    if (!data) return errorResponse(res, "Data NIK Cekal tidak ditemukan", 404);

    if (nik && nik !== data.nik) {
      const checkExist = await RefNikCekal.findOne({ where: { nik } });
      if (checkExist) return errorResponse(res, "NIK tersebut sudah ada di daftar cekal lain", 400);
    }

    await data.update({
      nik: nik || data.nik,
      nama: nama !== undefined ? nama : data.nama,
      tahun: tahun !== undefined ? tahun : data.tahun,
      keterangan: keterangan !== undefined ? keterangan : data.keterangan,
      is_aktif: is_aktif !== undefined ? is_aktif : data.is_aktif,
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

// ==========================================
// 6. EXPORT NIK CEKAL (UNTUK FITUR LAPORAN)
// ==========================================
exports.exportNikCekalExcel = async (req, res) => {
  try {
    const search = req.query.search || "";
    const whereCondition = search
      ? {
          [Op.or]: [
            { nik: { [Op.like]: `%${search}%` } },
            { nama: { [Op.like]: `%${search}%` } },
            { tahun: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const rows = await RefNikCekal.findAll({
      where: whereCondition,
      order: [["id", "DESC"]],
      raw: true
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Cekal");

    worksheet.columns = [
      { header: "No", key: "no", width: 8 },
      { header: "Nama Lengkap", key: "nama", width: 30 },
      { header: "NIK", key: "nik", width: 25 },
      { header: "Tahun", key: "tahun", width: 15 },
      { header: "Keterangan", key: "keterangan", width: 40 },
      { header: "Aktif Cekal", key: "is_aktif", width: 15 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0F0FF" }
      };
    });

    rows.forEach((row, index) => {
      worksheet.addRow({
        no: index + 1,
        nama: row.nama || "-",
        nik: row.nik,
        tahun: row.tahun || "-",
        keterangan: row.keterangan || "-",
        is_aktif: row.is_aktif === "Y" ? "Ceklis (Ya)" : "Tidak",
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=Data_Cekal.xlsx");

    await workbook.xlsx.write(res);
    return res.status(200).end();
  } catch (error) {
    console.error("Error exportNikCekalExcel:", error);
    return errorResponse(res, "Internal Server Error");
  }
};