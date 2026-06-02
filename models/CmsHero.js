const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const CmsHero = sequelize.define(
  "CmsHero",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Judul utama hero section",
    },
    subjudul: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Deskripsi singkat di bawah judul",
    },
    bg_image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Path atau URL gambar background 1",
    },
    bg_image_url_2: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Path atau URL gambar background 2",
    },
    bg_image_url_3: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Path atau URL gambar background 3",
    },
    label_cta: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Teks tombol Call-to-Action",
    },
    url_cta: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Link tujuan tombol CTA",
    },
    label_cta_2: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Teks tombol Call-to-Action 2 (Contoh: Download Panduan)",
    },
    url_cta_2: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Link tujuan tombol CTA 2",
    },

    judul_2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    subjudul_2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    s2_label_cta: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    s2_url_cta: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    s2_label_cta_2: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    s2_url_cta_2: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    // --- KONTEN SLIDE 3 ---
    judul_3: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    subjudul_3: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    s3_label_cta: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    s3_url_cta: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    s3_label_cta_2: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    s3_url_cta_2: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 1,
      comment: "1=aktif, 0=nonaktif",
    },
    created_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "cms_hero",
    timestamps: false,
  }
);

module.exports = CmsHero;