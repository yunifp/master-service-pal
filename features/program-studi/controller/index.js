const { RefProgramStudi, RefPerguruanTinggi } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");
const { Op } = require("sequelize");

exports.getProgramStudiByPtPagination = async (req, res) => {
  try {
    const { id_pt } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const whereCondition = {
      id_pt: id_pt,
      ...(search && {
        [Op.or]: [
          { nama_prodi: { [Op.like]: `%${search}%` } },
          { jenjang: { [Op.like]: `%${search}%` } },
        ],
      }),
    };

    const { count, rows } = await RefProgramStudi.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["nama_prodi", "ASC"]],
    });

    return successResponse(res, "Data program studi berhasil dimuat", {
      result: rows,
      total: count,
      current_page: page,
      total_pages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.getAllProgramStudiPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    let ptIdsFromSearch = [];
    
    if (search) {
      const matchingPts = await RefPerguruanTinggi.findAll({
        where: { nama_pt: { [Op.like]: `%${search}%` } },
        attributes: ["id_pt"],
        raw: true
      });
      ptIdsFromSearch = matchingPts.map(pt => pt.id_pt);
    }

    const whereCondition = search
      ? {
          [Op.or]: [
            { nama_prodi: { [Op.like]: `%${search}%` } },
            { jenjang: { [Op.like]: `%${search}%` } },
            ...(ptIdsFromSearch.length > 0 ? [{ id_pt: { [Op.in]: ptIdsFromSearch } }] : [])
          ],
        }
      : {};

    const { count, rows } = await RefProgramStudi.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["nama_prodi", "ASC"]],
      raw: true, 
    });

    const ptIds = [...new Set(rows.map(row => row.id_pt))]; 
    
    let ptMap = {};
    if (ptIds.length > 0) {
      const pts = await RefPerguruanTinggi.findAll({
        where: { id_pt: { [Op.in]: ptIds } },
        attributes: ["id_pt", "nama_pt"],
        raw: true
      });
      ptMap = pts.reduce((acc, pt) => {
        acc[pt.id_pt] = pt.nama_pt;
        return acc;
      }, {});
    }

    const resultRows = rows.map(row => ({
      ...row,
      RefPerguruanTinggi: {
        nama_pt: ptMap[row.id_pt] || "-"
      }
    }));

    return successResponse(res, "Semua data program studi berhasil dimuat", {
      result: resultRows,
      total: count,
      current_page: page,
      total_pages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.getDetailProgramStudi = async (req, res) => {
  try {
    const { id_prodi } = req.params;
    
    const prodi = await RefProgramStudi.findOne({
      where: { id_prodi },
    });

    if (!prodi) {
      return errorResponse(res, "Program studi tidak ditemukan", 404);
    }

    return successResponse(res, "Detail program studi berhasil dimuat", prodi);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.createProgramStudi = async (req, res) => {
  try {
    const {
      id_pt,
      jenjang,
      nama_prodi,
      kuota,
      boleh_buta_warna,
    } = req.body;

    // 1. Validasi Manual (Ini sudah bagus)
    const { RefPerguruanTinggi } = require("../../../models");
    const existingPt = await RefPerguruanTinggi.findOne({ where: { id_pt } });
    if (!existingPt) {
      return errorResponse(res, `Gagal menyimpan: Perguruan Tinggi dengan ID ${id_pt} tidak ditemukan.`, 404);
    }

    const payload = {
      id_pt,
      jenjang,
      nama_prodi,
      kuota,
      boleh_buta_warna,
    };

    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    // 2. Eksekusi Create
    const newProdi = await RefProgramStudi.create(payload);

    return successResponse(res, "Program studi berhasil ditambahkan", newProdi, 201);
  } catch (error) {
    console.error("ERROR CREATE PRODI:", error); // <-- Cek pesan error aslinya di sini
    
    // Jika benar-benar error FK (misal ID-nya ngawur)
    if (error.name === 'SequelizeForeignKeyConstraintError') {
       return errorResponse(res, "Gagal menyimpan: ID Perguruan Tinggi tidak valid atau telah dihapus.", 400);
    }
    return errorResponse(res, "Internal Server Error");
  }
};

exports.updateProgramStudi = async (req, res) => {
  try {
    const { id_prodi } = req.params;
    
    const {
      id_pt, 
      jenjang,
      nama_prodi,
      kuota,
      boleh_buta_warna,
    } = req.body;

    const prodi = await RefProgramStudi.findOne({ where: { id_prodi } });
    
    if (!prodi) {
      return errorResponse(res, "Program studi tidak ditemukan", 404);
    }

    const payload = {
      id_pt, 
      jenjang,
      nama_prodi,
      kuota,
      boleh_buta_warna,
    };

    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    await prodi.update(payload);

    return successResponse(res, "Program studi berhasil diperbarui");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.deleteProgramStudi = async (req, res) => {
  try {
    const { id_prodi } = req.params;
    
    const prodi = await RefProgramStudi.findOne({ where: { id_prodi } });
    
    if (!prodi) {
      return errorResponse(res, "Program studi tidak ditemukan", 404);
    }

    await prodi.destroy();

    return successResponse(res, "Program studi berhasil dihapus");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};


exports.updateKuotaButaWarna = async (req, res) => {
  try {
    const { id_prodi } = req.params;
    const { kuota, boleh_buta_warna } = req.body;

    const prodi = await RefProgramStudi.findOne({ where: { id_prodi } });
    
    if (!prodi) {
      return errorResponse(res, "Program studi tidak ditemukan", 404);
    }

    const payload = {};
    if (kuota !== undefined) payload.kuota = kuota;
    if (boleh_buta_warna !== undefined) payload.boleh_buta_warna = boleh_buta_warna;

    await prodi.update(payload);

    return successResponse(res, "Pengaturan kuota dan buta warna berhasil diperbarui", prodi);
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};