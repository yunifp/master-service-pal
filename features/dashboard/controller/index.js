const { RefProgramStudi, RefBeasiswa } = require("../../../models");
const { successResponse, errorResponse } = require("../../../common/response");

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Menghitung Jumlah Prodi yang dibuka (karena tidak ada status_aktif, kita hitung semua prodi yang ada)
    const jumlahProdi = await RefProgramStudi.count();

    // Opsional: Menghitung total kuota
    const totalKuota = await RefProgramStudi.sum("kuota");

    // 2. Mengambil data RefBeasiswa untuk Filter Periode
    const listPeriode = await RefBeasiswa.findAll({
      attributes: ["id", "nama_beasiswa", "status_aktif"],
      order: [["id", "DESC"]], // Urutkan dari yang terbaru
    });

    return successResponse(res, "Berhasil memuat statistik master dashboard", {
      jumlah_prodi: jumlahProdi,
      total_kuota: totalKuota || 0,
      list_periode: listPeriode
    });
  } catch (error) {
    console.error("Error getDashboardMasterStats:", error);
    return errorResponse(res, "Internal Server Error");
  }
};