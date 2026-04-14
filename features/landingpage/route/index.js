const express = require("express");
const router = express.Router();
const checkAuthorization = require("../../../common/middleware/auth_middleware");

const {
    getHeroAktif,
    getAllHero,
    getHeroById,
    createHero,
    updateHero,
    deleteHero,
    toggleActiveHero,

    getJalurAktif,
    getAllJalur,
    getJalurById,
    createJalur,
    updateJalur,
    deleteJalur,
    toggleActiveJalur,
    addSyarat, updateSyarat, deleteSyarat,
    addDokumen, updateDokumen, deleteDokumen,

    getKontakAktif,
    getAllKontak,
    getKontakById,
    createKontak,
    updateKontak,
    deleteKontak,
    toggleActiveKontak,

    getCmsTentangAktif,
    getAllCmsTentang,
    getCmsTentangById,
    createCmsTentang,
    updateCmsTentang,
    deleteCmsTentang,
    toggleActiveCmsTentang,
} = require("../controller");

// ═══════════════════════════════════════════
// PUBLIC — GET only, tanpa auth
// ═══════════════════════════════════════════
router.get("/hero", getHeroAktif);
router.get("/jalur", getJalurAktif);
router.get("/kontak", getKontakAktif);
router.get("/tentang", getCmsTentangAktif);

// ═══════════════════════════════════════════
// ADMIN — semua butuh auth
// ═══════════════════════════════════════════

// HERO
router.get("/hero/all", checkAuthorization, getAllHero);
router.get("/hero/:id", checkAuthorization, getHeroById);
router.post("/hero", checkAuthorization, createHero);
router.put("/hero/:id", checkAuthorization, updateHero);
router.delete("/hero/:id", checkAuthorization, deleteHero);
router.patch("/hero/:id/toggle-active", checkAuthorization, toggleActiveHero);

// JALUR
router.get("/jalur/all", checkAuthorization, getAllJalur);
router.get("/jalur/:id", checkAuthorization, getJalurById);
router.post("/jalur", checkAuthorization, createJalur);
router.put("/jalur/:id", checkAuthorization, updateJalur);
router.delete("/jalur/:id", checkAuthorization, deleteJalur);
router.patch("/jalur/:id/toggle-active", checkAuthorization, toggleActiveJalur);

router.post("/jalur/:id/syarat", checkAuthorization, addSyarat);
router.put("/jalur/:id/syarat/:syaratId", checkAuthorization, updateSyarat);
router.delete("/jalur/:id/syarat/:syaratId", checkAuthorization, deleteSyarat);
router.post("/jalur/:id/dokumen", checkAuthorization, addDokumen);
router.put("/jalur/:id/dokumen/:dokumenId", checkAuthorization, updateDokumen);
router.delete("/jalur/:id/dokumen/:dokumenId", checkAuthorization, deleteDokumen);

// KONTAK
router.get("/kontak/all", checkAuthorization, getAllKontak);
router.get("/kontak/:id", checkAuthorization, getKontakById);
router.post("/kontak", checkAuthorization, createKontak);
router.put("/kontak/:id", checkAuthorization, updateKontak);
router.delete("/kontak/:id", checkAuthorization, deleteKontak);
router.patch("/kontak/:id/toggle-active", checkAuthorization, toggleActiveKontak);

// TENTANG
router.get("/tentang/all", checkAuthorization, getAllCmsTentang);
router.get("/tentang/:id", checkAuthorization, getCmsTentangById);
router.post("/tentang", checkAuthorization, createCmsTentang);
router.put("/tentang/:id", checkAuthorization, updateCmsTentang);
router.delete("/tentang/:id", checkAuthorization, deleteCmsTentang);
router.patch("/tentang/:id/toggle-active", checkAuthorization, toggleActiveCmsTentang);

module.exports = router;