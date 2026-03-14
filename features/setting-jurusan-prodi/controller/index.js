const { 
  RefProgramStudi, 
  RefPerguruanTinggi, 
  RefMappingJurusanPtProdi,
  RefJurusanSekolah // <-- TAMBAHKAN DI SINI
} = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");
const { Op } = require("sequelize");

// 1. Get List Prodi + Status Mapping (Checked/Unchecked)
exports.getMappingJurusanProdi = async (req, res) => {
  try {
    const { id_jurusan_sekolah } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    // A. Cari ID Perguruan Tinggi yang cocok dengan pencarian
    let ptIdsFromSearch = [];
    if (search) {
      const matchingPts = await RefPerguruanTinggi.findAll({
        where: { nama_pt: { [Op.like]: `%${search}%` } },
        attributes: ["id_pt"],
        raw: true
      });
      ptIdsFromSearch = matchingPts.map(pt => pt.id_pt);
    }

    // B. Susun kondisi pencarian (bisa cari nama prodi, jenjang, atau nama kampus)
    const whereCondition = search ? {
      [Op.or]: [
        { nama_prodi: { [Op.like]: `%${search}%` } },
        { jenjang: { [Op.like]: `%${search}%` } },
        ...(ptIdsFromSearch.length > 0 ? [{ id_pt: { [Op.in]: ptIdsFromSearch } }] : [])
      ]
    } : {};

    // C. Ambil Data Program Studi (Pagination)
    const { count, rows } = await RefProgramStudi.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["nama_prodi", "ASC"]],
      raw: true,
    });

    if (rows.length === 0) {
       return successResponse(res, "Data dimuat", { result: [], total: count, current_page: page, total_pages: 0 });
    }

    // D. Ambil Nama Kampus agar tidak EagerLoadingError
    const ptIds = [...new Set(rows.map(row => row.id_pt))];
    const pts = await RefPerguruanTinggi.findAll({
      where: { id_pt: { [Op.in]: ptIds } },
      attributes: ["id_pt", "nama_pt"],
      raw: true
    });
    const ptMap = pts.reduce((acc, pt) => { acc[pt.id_pt] = pt.nama_pt; return acc; }, {});

    // E. MAGIC NYA DI SINI: Cek status mapping dari hasil rows yang didapat
    const prodiIds = rows.map(r => r.id_prodi);
    const mappings = await RefMappingJurusanPtProdi.findAll({
       where: {
         id_jurusan_sekolah,
         id_prodi: { [Op.in]: prodiIds }
       },
       raw: true
    });

    // Buat kumpulan ID prodi yang sudah ter-mapping agar ceknya cepat
    const mappedProdiIds = new Set(mappings.map(m => m.id_prodi));

    // F. Gabungkan semua data menjadi satu kesatuan
    const resultRows = rows.map(row => ({
      ...row,
      RefPerguruanTinggi: {
         nama_pt: ptMap[row.id_pt] || "-"
      },
      // Status boolean ini yang akan menentukan Checkbox dicentang atau tidak!
      is_mapped: mappedProdiIds.has(row.id_prodi) 
    }));

    return successResponse(res, "Data mapping berhasil dimuat", {
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

// 2. Fungsi untuk Centang / Hilangkan Centang (Insert / Delete)
exports.toggleMappingProdi = async (req, res) => {
  try {
    const { id_jurusan_sekolah, id_pt, id_prodi, is_mapped } = req.body;
    
    // Pastikan memanggil model yang dibutuhkan untuk mengambil nama teks
    const { 
      RefMappingJurusanPtProdi, 
      RefPerguruanTinggi, 
      RefProgramStudi, 
      RefJurusanSekolah 
    } = require("../../../models");

    console.log(`Menerima request mapping: Jurusan ${id_jurusan_sekolah}, PT ${id_pt}, Prodi ${id_prodi}, Status: ${is_mapped}`);

    if (is_mapped) {
      // 1. Ambil data nama teks-nya agar di database tidak NULL
      const ptData = await RefPerguruanTinggi.findByPk(id_pt);
      const prodiData = await RefProgramStudi.findByPk(id_prodi);
      const jurusanData = await RefJurusanSekolah.findByPk(id_jurusan_sekolah);

      // 2. Insert ke Database (Cari dulu, jika tidak ada baru buat)
      await RefMappingJurusanPtProdi.findOrCreate({
        where: { id_jurusan_sekolah, id_pt, id_prodi },
        defaults: { 
          id_jurusan_sekolah, 
          id_pt, 
          id_prodi,
          pt: ptData ? ptData.nama_pt : null,
          prodi: prodiData ? prodiData.nama_prodi : null,
          jurusan_sekolah: jurusanData ? jurusanData.jurusan : null
        }
      });
      console.log("-> Berhasil INSERT ke database!");

    } else {
      // Jika centang dihapus (false), kita Delete dari Database
      await RefMappingJurusanPtProdi.destroy({
        where: { id_jurusan_sekolah, id_pt, id_prodi }
      });
      console.log("-> Berhasil DELETE dari database!");
    }

    return successResponse(res, `Mapping berhasil di${is_mapped ? 'tambah' : 'hapus'}`);
  } catch(error) {
    console.error("====== ERROR TOGGLE MAPPING ======");
    console.error(error);
    return errorResponse(res, "Gagal mengupdate mapping jurusan");
  }
};


exports.getAllJurusanSekolah = async (req, res) => {
  try {

    const jurusanSekolah = await RefJurusanSekolah.findAll({
      order: [["jurusan", "ASC"]],
      raw: true, 
    });

    return successResponse(
      res,
      "Data semua jurusan sekolah berhasil dimuat",
      jurusanSekolah
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal Server Error");
  }
};