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
      comment: "Path atau URL gambar background",
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