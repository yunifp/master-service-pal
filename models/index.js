const RefBeasiswa = require("./RefBeasiswa");
const RefFlowBeasiswa = require("./RefFlowBeasiswa");
const RefJalur = require("./RefJalur");
const RefLembagaPendidikan = require("./RefLembagaPendidikan");
const RefPerguruanTinggi = require("./RefPerguruanTinggi");
const RefProgramStudi = require("./RefProgramStudi");
const RefJenjangSekolah = require("./RefJenjangSekolah");
const RefSyaratKhususBeasiswa = require("./RefSyaratKhususBeasiswa");
const RefSyaratUmumBeasiswa = require("./RefSyaratUmumBeasiswa");
const RefWilayah = require("./RefWilayah");
const RefMappingJurusanPtProdi = require("./RefMappingJurusanPtProdi");
const RefJenjang = require("./RefJenjang");
const RefAlasanTidakAktif = require("./RefAlasanTidakAktif");
const RefAgama = require("./RefAgama");
const RefSuku = require("./RefSuku");
const RefBank = require("./RefBank");
const RefNpsn = require("./RefNpsn");
const RefJurusanSekolah = require("./RefJurusanSekolah");
const RefPekerjaan = require("./RefPekerjaan");
const RefPenghasilan = require("./RefPenghasilan");
const CmsJalurPendaftaran = require("./CmsJalurPendaftaran");
const CmsJalurSyarat = require("./CmsJalurSyarat");
const CmsJalurDokumen = require("./CmsJalurDokumen");
const RefNikCekal = require("./RefNikCekal");

// Buat object models supaya gampang akses
const models = {
  RefBeasiswa,
  RefFlowBeasiswa,
  RefJalur,
  RefPerguruanTinggi,
  RefProgramStudi,
  RefSyaratKhususBeasiswa,
  RefSyaratUmumBeasiswa,
  RefWilayah,
  RefJenjangSekolah,
  RefLembagaPendidikan,
  RefMappingJurusanPtProdi,
  RefJenjang,
  RefAlasanTidakAktif,
  RefAgama,
  RefSuku,
  RefBank,
  RefNpsn,
  RefJurusanSekolah,
  RefPekerjaan,
  RefPenghasilan,
  CmsJalurPendaftaran,
  CmsJalurSyarat,
  CmsJalurDokumen,
  RefNikCekal
};

RefProgramStudi.belongsTo(RefPerguruanTinggi, {
  foreignKey: "id_pt",
  as: "perguruan_tinggi",
});

RefPerguruanTinggi.hasMany(RefProgramStudi, {
  foreignKey: "id_pt",
  as: "program_studi",
});

RefSyaratKhususBeasiswa.belongsTo(RefJalur, {
  foreignKey: "id_jalur",
  as: "jalur",
});

RefJalur.hasMany(RefSyaratKhususBeasiswa, {
  foreignKey: "id_jalur",
  as: "syarat_khusus",
});

// Relasi self-referencing
RefWilayah.hasMany(RefWilayah, {
  foreignKey: "parent",
  as: "subWilayah",
});

RefWilayah.belongsTo(RefWilayah, {
  foreignKey: "parent",
  as: "indukWilayah",
});

RefMappingJurusanPtProdi.belongsTo(RefPerguruanTinggi, {
  foreignKey: "id_pt",
  targetKey: "id_pt", // atau "id" jika PK-nya id
  as: "perguruanTinggi",
});

RefPerguruanTinggi.hasMany(RefMappingJurusanPtProdi, {
  foreignKey: "id_pt",
  sourceKey: "id_pt", // atau "id"
  as: "mappingJurusan",
});

RefProgramStudi.hasMany(RefMappingJurusanPtProdi, {
  foreignKey: "id_prodi",
  sourceKey: "id_prodi",
  as: "mappingJurusan",
});

RefMappingJurusanPtProdi.belongsTo(RefProgramStudi, {
  foreignKey: "id_prodi",
  targetKey: "id_prodi",
  as: "programStudi",
});

// ═══════════════════════════════════════════════
// CMS JALUR PENDAFTARAN RELATIONS
// ═══════════════════════════════════════════════

CmsJalurPendaftaran.hasMany(CmsJalurSyarat, {
  foreignKey: "id_jalur",
  as: "syarat",
});

CmsJalurSyarat.belongsTo(CmsJalurPendaftaran, {
  foreignKey: "id_jalur",
  as: "jalur",
});

CmsJalurPendaftaran.hasMany(CmsJalurDokumen, {
  foreignKey: "id_jalur",
  as: "dokumen",
});

CmsJalurDokumen.belongsTo(CmsJalurPendaftaran, {
  foreignKey: "id_jalur",
  as: "jalur",
});

module.exports = models;
