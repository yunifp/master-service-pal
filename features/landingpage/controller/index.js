const { Op } = require("sequelize");
const CmsHero = require("../../../models/CmsHero");
const CmsJalurPendaftaran = require("../../../models/CmsJalurPendaftaran");
const CmsJalurSyarat = require("../../../models/CmsJalurSyarat");
const CmsJalurDokumen = require("../../../models/CmsJalurDokumen");
const CmsKontak = require("../../../models/CmsKontak");
const CmsTentangBeasiswa = require("../../../models/CmsTentangBeasiswa");
const { successResponse, errorResponse } = require("../../../common/response");
const { getFileUrl } = require("../../../common/middleware/upload_middleware");

/**
 * GET /cms/hero
 */
exports.getHeroAktif = async (req, res) => {
  try {
    const hero = await CmsHero.findOne({
      where: { is_active: 1 },
      order: [["id", "DESC"]],
    });

    if (!hero) return errorResponse(res, "Data hero tidak ditemukan", 404);

    return successResponse(res, "Berhasil memuat data hero", hero);
  } catch (error) {
    console.error("getHeroAktif:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * GET /cms/hero/all
 */
exports.getAllHero = async (req, res) => {
  try {
    const rows = await CmsHero.findAll({ order: [["id", "DESC"]] });
    return successResponse(res, "Berhasil memuat semua data hero", rows);
  } catch (error) {
    console.error("getAllHero:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * GET /cms/hero/:id
 */
exports.getHeroById = async (req, res) => {
  try {
    const { id } = req.params;
    const hero = await CmsHero.findByPk(id);

    if (!hero) return errorResponse(res, "Data hero tidak ditemukan", 404);

    return successResponse(res, "Berhasil memuat data hero", hero);
  } catch (error) {
    console.error("getHeroById:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * POST /cms/hero
 */
exports.createHero = async (req, res) => {
  try {
    const {
      judul, subjudul, label_cta, url_cta, is_active, created_by,
    } = req.body;

    if (!judul) return errorResponse(res, "Judul wajib diisi", 400);

    // Prioritaskan dari file upload, jika tidak ada, ambil dari teks url
    let final_bg_1 = req.body.bg_image_url || null;
    let final_bg_2 = req.body.bg_image_url_2 || null;
    let final_bg_3 = req.body.bg_image_url_3 || null;

    if (req.files) {
      if (req.files.bg_image_url) final_bg_1 = getFileUrl(req, "cms_hero", req.files.bg_image_url[0].filename);
      if (req.files.bg_image_url_2) final_bg_2 = getFileUrl(req, "cms_hero", req.files.bg_image_url_2[0].filename);
      if (req.files.bg_image_url_3) final_bg_3 = getFileUrl(req, "cms_hero", req.files.bg_image_url_3[0].filename);
    }

    if (is_active == 1) {
      await CmsHero.update({ is_active: 0 }, { where: { is_active: 1 } });
    }

    const newHero = await CmsHero.create({
      judul,
      subjudul: subjudul || null,
      bg_image_url: final_bg_1,
      bg_image_url_2: final_bg_2,
      bg_image_url_3: final_bg_3,
      label_cta: label_cta || "Daftar Sekarang",
      url_cta: url_cta || "/daftar-penerima-beasiswa",
      is_active: is_active !== undefined ? is_active : 1,
      created_by: created_by || null,
      created_at: new Date(),
    });

    return successResponse(res, "Berhasil menambahkan data hero", newHero, 201);
  } catch (error) {
    console.error("createHero:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.updateHero = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      judul, subjudul, label_cta, url_cta, is_active, updated_by,
    } = req.body;

    const hero = await CmsHero.findByPk(id);
    if (!hero) return errorResponse(res, "Data hero tidak ditemukan", 404);

    let final_bg_1 = req.body.bg_image_url !== undefined ? req.body.bg_image_url : hero.bg_image_url;
    let final_bg_2 = req.body.bg_image_url_2 !== undefined ? req.body.bg_image_url_2 : hero.bg_image_url_2;
    let final_bg_3 = req.body.bg_image_url_3 !== undefined ? req.body.bg_image_url_3 : hero.bg_image_url_3;

    if (req.files) {
      if (req.files.bg_image_url) final_bg_1 = getFileUrl(req, "cms_hero", req.files.bg_image_url[0].filename);
      if (req.files.bg_image_url_2) final_bg_2 = getFileUrl(req, "cms_hero", req.files.bg_image_url_2[0].filename);
      if (req.files.bg_image_url_3) final_bg_3 = getFileUrl(req, "cms_hero", req.files.bg_image_url_3[0].filename);
    }

    if (is_active == 1) {
      await CmsHero.update({ is_active: 0 }, { where: { is_active: 1 } });
    }

    await hero.update({
      judul: judul !== undefined ? judul : hero.judul,
      subjudul: subjudul !== undefined ? subjudul : hero.subjudul,
      bg_image_url: final_bg_1,
      bg_image_url_2: final_bg_2,
      bg_image_url_3: final_bg_3,
      label_cta: label_cta !== undefined ? label_cta : hero.label_cta,
      url_cta: url_cta !== undefined ? url_cta : hero.url_cta,
      is_active: is_active !== undefined ? is_active : hero.is_active,
      updated_by: updated_by || null,
      updated_at: new Date(),
    });

    return successResponse(res, "Berhasil memperbarui data hero");
  } catch (error) {
    console.error("updateHero:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * DELETE /cms/hero/:id
 */
exports.deleteHero = async (req, res) => {
  try {
    const { id } = req.params;

    const hero = await CmsHero.findByPk(id);
    if (!hero) return errorResponse(res, "Data hero tidak ditemukan", 404);

    await hero.destroy();

    return successResponse(res, "Berhasil menghapus data hero");
  } catch (error) {
    console.error("deleteHero:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * PATCH /cms/hero/:id/toggle-active
 */
exports.toggleActiveHero = async (req, res) => {
  try {
    const { id } = req.params;

    const hero = await CmsHero.findByPk(id);
    if (!hero) return errorResponse(res, "Data hero tidak ditemukan", 404);

    const newStatus = hero.is_active === 1 ? 0 : 1;

    if (newStatus === 1) {
      await CmsHero.update({ is_active: 0 }, { where: { is_active: 1 } });
    }

    await hero.update({ is_active: newStatus, updated_at: new Date() });

    return successResponse(
      res,
      `Hero berhasil ${newStatus === 1 ? "diaktifkan" : "dinonaktifkan"}`,
      { is_active: newStatus }
    );
  } catch (error) {
    console.error("toggleActiveHero:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ─── Helper: include syarat & dokumen ────────────────────────────────────────
const includeDetail = [
  {
    model: CmsJalurSyarat,
    as: "syarat",
    attributes: ["id", "syarat", "urutan", "template_link"],
    order: [["urutan", "ASC"]],
  },
  {
    model: CmsJalurDokumen,
    as: "dokumen",
    attributes: ["id", "dokumen", "urutan", "template_link"],
    order: [["urutan", "ASC"]],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// JALUR PENDAFTARAN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /cms/jalur
 */
exports.getJalurAktif = async (req, res) => {
  try {
    const rows = await CmsJalurPendaftaran.findAll({
      where: { is_active: 1 },
      order: [["urutan", "ASC"]],
      include: includeDetail,
    });

    return successResponse(res, "Berhasil memuat jalur pendaftaran", rows);
  } catch (error) {
    console.error("getJalurAktif:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * GET /cms/jalur/all
 */
exports.getAllJalur = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const where = {};
    if (search) {
      where.judul = { [Op.like]: `%${search}%` };
    }

    const rows = await CmsJalurPendaftaran.findAll({
      where,
      order: [["urutan", "ASC"]],
      include: includeDetail,
    });

    return successResponse(res, "Berhasil memuat semua jalur", rows);
  } catch (error) {
    console.error("getAllJalur:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * GET /cms/jalur/:id
 */
exports.getJalurById = async (req, res) => {
  try {
    const { id } = req.params;

    const jalur = await CmsJalurPendaftaran.findByPk(id, {
      include: includeDetail,
    });

    if (!jalur) return errorResponse(res, "Jalur tidak ditemukan", 404);

    return successResponse(res, "Berhasil memuat detail jalur", jalur);
  } catch (error) {
    console.error("getJalurById:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * POST /cms/jalur
 */
exports.createJalur = async (req, res) => {
  try {
    const {
      judul,
      deskripsi,
      urutan,
      is_active,
      created_by,
    } = req.body;
    
    let { syarat, dokumen } = req.body;
    
    // Parse JSON jika request dalam format form-data
    if (typeof syarat === 'string') syarat = JSON.parse(syarat);
    if (typeof dokumen === 'string') dokumen = JSON.parse(dokumen);
    
    syarat = syarat || [];
    dokumen = dokumen || [];

    if (!judul) return errorResponse(res, "Judul jalur wajib diisi", 400);

    let final_gambar = req.body.gambar_url || null;
    if (req.file) {
      final_gambar = getFileUrl(req, "cms_jalur", req.file.filename);
    }

    const newJalur = await CmsJalurPendaftaran.create({
      judul,
      deskripsi: deskripsi || null,
      gambar_url: final_gambar,
      urutan: urutan || 0,
      is_active: is_active !== undefined ? is_active : 1,
      created_by: created_by || null,
      created_at: new Date(),
    });

    if (syarat.length > 0) {
      const syaratRows = syarat.map((s, i) => ({
        id_jalur: newJalur.id,
        syarat: s.syarat,
        template_link: s.template_link || null,
        urutan: s.urutan !== undefined ? s.urutan : i + 1,
        created_at: new Date(),
      }));
      await CmsJalurSyarat.bulkCreate(syaratRows);
    }

    if (dokumen.length > 0) {
      const dokumenRows = dokumen.map((d, i) => ({
        id_jalur: newJalur.id,
        dokumen: d.dokumen,
        template_link: d.template_link || null,
        urutan: d.urutan !== undefined ? d.urutan : i + 1,
        created_at: new Date(),
      }));
      await CmsJalurDokumen.bulkCreate(dokumenRows);
    }

    const result = await CmsJalurPendaftaran.findByPk(newJalur.id, {
      include: includeDetail,
    });

    return successResponse(res, "Berhasil menambahkan jalur", result, 201);
  } catch (error) {
    console.error("createJalur:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * PUT /cms/jalur/:id
 */
exports.updateJalur = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      judul,
      deskripsi,
      urutan,
      is_active,
      updated_by,
    } = req.body;
    
    let { syarat, dokumen } = req.body;
    
    if (typeof syarat === 'string') syarat = JSON.parse(syarat);
    if (typeof dokumen === 'string') dokumen = JSON.parse(dokumen);

    const jalur = await CmsJalurPendaftaran.findByPk(id);
    if (!jalur) return errorResponse(res, "Jalur tidak ditemukan", 404);

    let final_gambar = req.body.gambar_url !== undefined ? req.body.gambar_url : jalur.gambar_url;
    if (req.file) {
      final_gambar = getFileUrl(req, "cms_jalur", req.file.filename);
    }

    await jalur.update({
      judul: judul !== undefined ? judul : jalur.judul,
      deskripsi: deskripsi !== undefined ? deskripsi : jalur.deskripsi,
      gambar_url: final_gambar,
      urutan: urutan !== undefined ? urutan : jalur.urutan,
      is_active: is_active !== undefined ? is_active : jalur.is_active,
      updated_by: updated_by || null,
      updated_at: new Date(),
    });

    if (syarat !== undefined) {
      await CmsJalurSyarat.destroy({ where: { id_jalur: id } });
      if (syarat.length > 0) {
        const syaratRows = syarat.map((s, i) => ({
          id_jalur: Number(id),
          syarat: s.syarat,
          template_link: s.template_link || null,
          urutan: s.urutan !== undefined ? s.urutan : i + 1,
          created_at: new Date(),
        }));
        await CmsJalurSyarat.bulkCreate(syaratRows);
      }
    }

    if (dokumen !== undefined) {
      await CmsJalurDokumen.destroy({ where: { id_jalur: id } });
      if (dokumen.length > 0) {
        const dokumenRows = dokumen.map((d, i) => ({
          id_jalur: Number(id),
          dokumen: d.dokumen,
          template_link: d.template_link || null,
          urutan: d.urutan !== undefined ? d.urutan : i + 1,
          created_at: new Date(),
        }));
        await CmsJalurDokumen.bulkCreate(dokumenRows);
      }
    }

    return successResponse(res, "Berhasil memperbarui jalur");
  } catch (error) {
    console.error("updateJalur:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * DELETE /cms/jalur/:id
 */
exports.deleteJalur = async (req, res) => {
  try {
    const { id } = req.params;

    const jalur = await CmsJalurPendaftaran.findByPk(id);
    if (!jalur) return errorResponse(res, "Jalur tidak ditemukan", 404);

    await jalur.destroy();

    return successResponse(res, "Berhasil menghapus jalur");
  } catch (error) {
    console.error("deleteJalur:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

/**
 * PATCH /cms/jalur/:id/toggle-active
 */
exports.toggleActiveJalur = async (req, res) => {
  try {
    const { id } = req.params;

    const jalur = await CmsJalurPendaftaran.findByPk(id);
    if (!jalur) return errorResponse(res, "Jalur tidak ditemukan", 404);

    const newStatus = jalur.is_active === 1 ? 0 : 1;
    await jalur.update({ is_active: newStatus, updated_at: new Date() });

    return successResponse(
      res,
      `Jalur berhasil ${newStatus === 1 ? "diaktifkan" : "dinonaktifkan"}`,
      { is_active: newStatus }
    );
  } catch (error) {
    console.error("toggleActiveJalur:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SYARAT
// ═══════════════════════════════════════════════════════════════════════════════

exports.addSyarat = async (req, res) => {
  try {
    const { id } = req.params;
    const { syarat, urutan, template_link } = req.body;

    if (!syarat) return errorResponse(res, "Syarat wajib diisi", 400);

    const jalur = await CmsJalurPendaftaran.findByPk(id);
    if (!jalur) return errorResponse(res, "Jalur tidak ditemukan", 404);

    const maxUrutan = await CmsJalurSyarat.max("urutan", {
      where: { id_jalur: id },
    });

    const newSyarat = await CmsJalurSyarat.create({
      id_jalur: Number(id),
      syarat,
      template_link: template_link || null,
      urutan: urutan !== undefined ? urutan : (maxUrutan || 0) + 1,
      created_at: new Date(),
    });

    return successResponse(res, "Berhasil menambahkan syarat", newSyarat, 201);
  } catch (error) {
    console.error("addSyarat:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.updateSyarat = async (req, res) => {
  try {
    const { syaratId } = req.params;
    const { syarat, urutan, template_link } = req.body;

    const data = await CmsJalurSyarat.findByPk(syaratId);
    if (!data) return errorResponse(res, "Syarat tidak ditemukan", 404);

    await data.update({
      syarat: syarat !== undefined ? syarat : data.syarat,
      template_link: template_link !== undefined ? template_link : data.template_link,
      urutan: urutan !== undefined ? urutan : data.urutan,
      updated_at: new Date(),
    });

    return successResponse(res, "Berhasil memperbarui syarat");
  } catch (error) {
    console.error("updateSyarat:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.deleteSyarat = async (req, res) => {
  try {
    const { syaratId } = req.params;

    const data = await CmsJalurSyarat.findByPk(syaratId);
    if (!data) return errorResponse(res, "Syarat tidak ditemukan", 404);

    await data.destroy();
    return successResponse(res, "Berhasil menghapus syarat");
  } catch (error) {
    console.error("deleteSyarat:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DOKUMEN
// ═══════════════════════════════════════════════════════════════════════════════

exports.addDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const { dokumen, urutan, template_link } = req.body;

    if (!dokumen) return errorResponse(res, "Dokumen wajib diisi", 400);

    const jalur = await CmsJalurPendaftaran.findByPk(id);
    if (!jalur) return errorResponse(res, "Jalur tidak ditemukan", 404);

    const maxUrutan = await CmsJalurDokumen.max("urutan", {
      where: { id_jalur: id },
    });

    const newDokumen = await CmsJalurDokumen.create({
      id_jalur: Number(id),
      dokumen,
      template_link: template_link || null,
      urutan: urutan !== undefined ? urutan : (maxUrutan || 0) + 1,
      created_at: new Date(),
    });

    return successResponse(res, "Berhasil menambahkan dokumen", newDokumen, 201);
  } catch (error) {
    console.error("addDokumen:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.updateDokumen = async (req, res) => {
  try {
    const { dokumenId } = req.params;
    const { dokumen, urutan, template_link } = req.body;

    const data = await CmsJalurDokumen.findByPk(dokumenId);
    if (!data) return errorResponse(res, "Dokumen tidak ditemukan", 404);

    await data.update({
      dokumen: dokumen !== undefined ? dokumen : data.dokumen,
      template_link: template_link !== undefined ? template_link : data.template_link,
      urutan: urutan !== undefined ? urutan : data.urutan,
      updated_at: new Date(),
    });

    return successResponse(res, "Berhasil memperbarui dokumen");
  } catch (error) {
    console.error("updateDokumen:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.deleteDokumen = async (req, res) => {
  try {
    const { dokumenId } = req.params;

    const data = await CmsJalurDokumen.findByPk(dokumenId);
    if (!data) return errorResponse(res, "Dokumen tidak ditemukan", 404);

    await data.destroy();
    return successResponse(res, "Berhasil menghapus dokumen");
  } catch (error) {
    console.error("deleteDokumen:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// KONTAK
// ═══════════════════════════════════════════════════════════════════════════════

exports.getKontakAktif = async (req, res) => {
  try {
    const kontak = await CmsKontak.findOne({
      where: { is_active: 1 },
      order: [["id", "DESC"]],
    });

    if (!kontak) return errorResponse(res, "Data kontak tidak ditemukan", 404);

    return successResponse(res, "Berhasil memuat data kontak", kontak);
  } catch (error) {
    console.error("getKontakAktif:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.getAllKontak = async (req, res) => {
  try {
    const rows = await CmsKontak.findAll({ order: [["id", "DESC"]] });
    return successResponse(res, "Berhasil memuat semua data kontak", rows);
  } catch (error) {
    console.error("getAllKontak:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.getKontakById = async (req, res) => {
  try {
    const { id } = req.params;
    const kontak = await CmsKontak.findByPk(id);

    if (!kontak) return errorResponse(res, "Data kontak tidak ditemukan", 404);

    return successResponse(res, "Berhasil memuat data kontak", kontak);
  } catch (error) {
    console.error("getKontakById:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.createKontak = async (req, res) => {
  try {
    const {
      judul_section, nama_instansi, alamat, telepon, email, whatsapp,
      jam_operasional, maps_embed_url, maps_lat, maps_lng, is_active, created_by,
    } = req.body;

    if (is_active == 1) {
      await CmsKontak.update({ is_active: 0 }, { where: { is_active: 1 } });
    }

    const newKontak = await CmsKontak.create({
      judul_section: judul_section || "Kontak",
      nama_instansi: nama_instansi || null,
      alamat: alamat || null,
      telepon: telepon || null,
      email: email || null,
      whatsapp: whatsapp || null,
      jam_operasional: jam_operasional || null,
      maps_embed_url: maps_embed_url || null,
      maps_lat: maps_lat || null,
      maps_lng: maps_lng || null,
      is_active: is_active !== undefined ? is_active : 1,
      created_by: created_by || null,
    });

    return successResponse(res, "Berhasil menambahkan data kontak", newKontak, 201);
  } catch (error) {
    console.error("createKontak:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.updateKontak = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      judul_section, nama_instansi, alamat, telepon, email, whatsapp,
      jam_operasional, maps_embed_url, maps_lat, maps_lng, is_active, updated_by,
    } = req.body;

    const kontak = await CmsKontak.findByPk(id);
    if (!kontak) return errorResponse(res, "Data kontak tidak ditemukan", 404);

    if (is_active == 1) {
      await CmsKontak.update({ is_active: 0 }, { where: { is_active: 1 } });
    }

    await kontak.update({
      judul_section: judul_section !== undefined ? judul_section : kontak.judul_section,
      nama_instansi: nama_instansi !== undefined ? nama_instansi : kontak.nama_instansi,
      alamat: alamat !== undefined ? alamat : kontak.alamat,
      telepon: telepon !== undefined ? telepon : kontak.telepon,
      email: email !== undefined ? email : kontak.email,
      whatsapp: whatsapp !== undefined ? whatsapp : kontak.whatsapp,
      jam_operasional: jam_operasional !== undefined ? jam_operasional : kontak.jam_operasional,
      maps_embed_url: maps_embed_url !== undefined ? maps_embed_url : kontak.maps_embed_url,
      maps_lat: maps_lat !== undefined ? maps_lat : kontak.maps_lat,
      maps_lng: maps_lng !== undefined ? maps_lng : kontak.maps_lng,
      is_active: is_active !== undefined ? is_active : kontak.is_active,
      updated_by: updated_by || null,
    });

    return successResponse(res, "Berhasil memperbarui data kontak");
  } catch (error) {
    console.error("updateKontak:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.deleteKontak = async (req, res) => {
  try {
    const { id } = req.params;

    const kontak = await CmsKontak.findByPk(id);
    if (!kontak) return errorResponse(res, "Data kontak tidak ditemukan", 404);

    await kontak.destroy();

    return successResponse(res, "Berhasil menghapus data kontak");
  } catch (error) {
    console.error("deleteKontak:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.toggleActiveKontak = async (req, res) => {
  try {
    const { id } = req.params;

    const kontak = await CmsKontak.findByPk(id);
    if (!kontak) return errorResponse(res, "Data kontak tidak ditemukan", 404);

    const newStatus = kontak.is_active === 1 ? 0 : 1;

    if (newStatus === 1) {
      await CmsKontak.update({ is_active: 0 }, { where: { is_active: 1 } });
    }

    await kontak.update({ is_active: newStatus });

    return successResponse(
      res,
      `Kontak berhasil ${newStatus === 1 ? "diaktifkan" : "dinonaktifkan"}`,
      { is_active: newStatus }
    );
  } catch (error) {
    console.error("toggleActiveKontak:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// TENTANG BEASISWA
// ═══════════════════════════════════════════════════════════════════════════════

exports.getCmsTentangAktif = async (req, res) => {
  try {
    const tentang = await CmsTentangBeasiswa.findOne({
      where: { is_active: 1 },
      order: [["id", "DESC"]],
    });

    if (!tentang) return errorResponse(res, "Data tentang tidak ditemukan", 404);

    return successResponse(res, "Berhasil memuat data tentang beasiswa", tentang);
  } catch (error) {
    console.error("getTentangAktif:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.getAllCmsTentang = async (req, res) => {
  try {
    const rows = await CmsTentangBeasiswa.findAll({
      order: [["id", "DESC"]],
    });
    return successResponse(res, "Berhasil memuat semua data tentang beasiswa", rows);
  } catch (error) {
    console.error("getAllTentang:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.getCmsTentangById = async (req, res) => {
  try {
    const { id } = req.params;

    const tentang = await CmsTentangBeasiswa.findByPk(id);
    if (!tentang) return errorResponse(res, "Data tentang tidak ditemukan", 404);

    return successResponse(res, "Berhasil memuat data tentang beasiswa", tentang);
  } catch (error) {
    console.error("getTentangById:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.createCmsTentang = async (req, res) => {
  try {
    const {
      judul_section, deskripsi, is_active, created_by,
    } = req.body;

    let final_gambar = req.body.gambar_url || null;
    if (req.file) {
      final_gambar = getFileUrl(req, "cms_tentang", req.file.filename);
    }

    if (is_active == 1) {
      await CmsTentangBeasiswa.update(
        { is_active: 0 },
        { where: { is_active: 1 } }
      );
    }

    const newTentang = await CmsTentangBeasiswa.create({
      judul_section: judul_section || "Tentang Beasiswa",
      deskripsi: deskripsi || null,
      gambar_url: final_gambar,
      is_active: is_active !== undefined ? is_active : 1,
      created_by: created_by || null,
    });

    return successResponse(
      res,
      "Berhasil menambahkan data tentang beasiswa",
      newTentang,
      201
    );
  } catch (error) {
    console.error("createTentang:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.updateCmsTentang = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      judul_section, deskripsi, is_active, updated_by,
    } = req.body;

    const tentang = await CmsTentangBeasiswa.findByPk(id);
    if (!tentang) return errorResponse(res, "Data tentang tidak ditemukan", 404);

    let final_gambar = req.body.gambar_url !== undefined ? req.body.gambar_url : tentang.gambar_url;
    if (req.file) {
      final_gambar = getFileUrl(req, "cms_tentang", req.file.filename);
    }

    if (is_active == 1) {
      await CmsTentangBeasiswa.update(
        { is_active: 0 },
        { where: { is_active: 1 } }
      );
    }

    await tentang.update({
      judul_section: judul_section !== undefined ? judul_section : tentang.judul_section,
      deskripsi: deskripsi !== undefined ? deskripsi : tentang.deskripsi,
      gambar_url: final_gambar,
      is_active: is_active !== undefined ? is_active : tentang.is_active,
      updated_by: updated_by || null,
    });

    return successResponse(res, "Berhasil memperbarui data tentang beasiswa");
  } catch (error) {
    console.error("updateTentang:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.deleteCmsTentang = async (req, res) => {
  try {
    const { id } = req.params;

    const tentang = await CmsTentangBeasiswa.findByPk(id);
    if (!tentang) return errorResponse(res, "Data tentang tidak ditemukan", 404);

    await tentang.destroy();

    return successResponse(res, "Berhasil menghapus data tentang beasiswa");
  } catch (error) {
    console.error("deleteTentang:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

exports.toggleActiveCmsTentang = async (req, res) => {
  try {
    const { id } = req.params;

    const tentang = await CmsTentangBeasiswa.findByPk(id);
    if (!tentang) return errorResponse(res, "Data tentang tidak ditemukan", 404);

    const newStatus = tentang.is_active === 1 ? 0 : 1;

    if (newStatus === 1) {
      await CmsTentangBeasiswa.update(
        { is_active: 0 },
        { where: { is_active: 1 } }
      );
    }

    await tentang.update({ is_active: newStatus });

    return successResponse(
      res,
      `Tentang beasiswa berhasil ${newStatus === 1 ? "diaktifkan" : "dinonaktifkan"}`,
      { is_active: newStatus }
    );
  } catch (error) {
    console.error("toggleActiveTentang:", error);
    return errorResponse(res, "Internal Server Error");
  }
};