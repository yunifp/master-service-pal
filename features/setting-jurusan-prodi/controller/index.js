const { 
  RefProgramStudi, 
  RefPerguruanTinggi, 
  RefMappingJurusanPtProdi,
  RefJurusanSekolah 
} = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");
const { Op } = require("sequelize");

exports.getMappingJurusanProdi = async (req, res) => {
  try {
    const { id_jurusan_sekolah } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const mapped_only = req.query.mapped_only === "true";
    const id_pt_filter = req.query.id_pt;

    let ptIdsFromSearch = [];
    if (search) {
      const matchingPts = await RefPerguruanTinggi.findAll({
        where: { nama_pt: { [Op.like]: `%${search}%` } },
        attributes: ["id_pt"],
        raw: true
      });
      ptIdsFromSearch = matchingPts.map(pt => pt.id_pt);
    }

    const whereCondition = search ? {
      [Op.or]: [
        { nama_prodi: { [Op.like]: `%${search}%` } },
        { jenjang: { [Op.like]: `%${search}%` } },
        ...(ptIdsFromSearch.length > 0 ? [{ id_pt: { [Op.in]: ptIdsFromSearch } }] : [])
      ]
    } : {};

    if (id_pt_filter && id_pt_filter !== "all") {
      whereCondition.id_pt = id_pt_filter;
    }

    const includeOptions = [];
    if (mapped_only) {
      includeOptions.push({
        model: RefMappingJurusanPtProdi,
        as: "mappingJurusan", 
        where: { id_jurusan_sekolah },
        required: true,
        attributes: [] 
      });
    }

    const { count, rows } = await RefProgramStudi.findAndCountAll({
      where: whereCondition,
      include: includeOptions,
      limit,
      offset,
      distinct: true,
      order: [["nama_prodi", "ASC"]],
    });

    const plainRows = rows.map(r => r.get({ plain: true }));

    if (plainRows.length === 0) {
       return successResponse(res, "Data dimuat", { result: [], total: count, current_page: page, total_pages: 0 });
    }

    const ptIds = [...new Set(plainRows.map(row => row.id_pt))];
    const pts = await RefPerguruanTinggi.findAll({
      where: { id_pt: { [Op.in]: ptIds } },
      attributes: ["id_pt", "nama_pt"],
      raw: true
    });
    const ptMap = pts.reduce((acc, pt) => { acc[pt.id_pt] = pt.nama_pt; return acc; }, {});

    const prodiIds = plainRows.map(r => r.id_prodi);
    const mappings = await RefMappingJurusanPtProdi.findAll({
       where: {
         id_jurusan_sekolah,
         id_prodi: { [Op.in]: prodiIds }
       },
       raw: true
    });
    
    const mappedProdiIds = new Set(mappings.map(m => m.id_prodi));

    const resultRows = plainRows.map(row => ({
      ...row,
      RefPerguruanTinggi: {
         nama_pt: ptMap[row.id_pt] || "-"
      },
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

exports.toggleMappingProdi = async (req, res) => {
  try {
    const { id_jurusan_sekolah, id_pt, id_prodi, is_mapped } = req.body;
    
    const { 
      RefMappingJurusanPtProdi, 
      RefPerguruanTinggi, 
      RefProgramStudi, 
      RefJurusanSekolah 
    } = require("../../../models");

    if (is_mapped) {
      const ptData = await RefPerguruanTinggi.findByPk(id_pt);
      const prodiData = await RefProgramStudi.findByPk(id_prodi);
      const jurusanData = await RefJurusanSekolah.findByPk(id_jurusan_sekolah);

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
    } else {
      await RefMappingJurusanPtProdi.destroy({
        where: { id_jurusan_sekolah, id_pt, id_prodi }
      });
    }

    return successResponse(res, `Mapping berhasil di${is_mapped ? 'tambah' : 'hapus'}`);
  } catch(error) {
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