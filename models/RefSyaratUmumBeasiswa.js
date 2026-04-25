const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefSyaratUmumBeasiswa = sequelize.define(
  "RefSyaratUmumBeasiswa",
  {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    persyaratan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_aktif: {
      type: DataTypes.ENUM("Y", "N"),
      allowNull: true,
      defaultValue: "Y",
    },
    valid_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_required: {
      type: DataTypes.ENUM("Y", "N"),
      allowNull: true,
      defaultValue: "Y",
    },
    // ---- TAMBAHAN KOLOM BARU MULAI DI SINI ----
    is_kabkota: {
      type: DataTypes.ENUM("Y", "N"),
      allowNull: true,
      defaultValue: "N",
    },
    is_prov: {
      type: DataTypes.ENUM("Y", "N"),
      allowNull: true,
      defaultValue: "N",
    },
    size: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    // ---- TAMBAHAN KOLOM BARU SELESAI ----
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "ref_syarat_umum_beasiswa",
    timestamps: false,
  }
);

module.exports = RefSyaratUmumBeasiswa;