const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefMappingJurusanPtProdi = sequelize.define(
  "RefMappingJurusanPtProdi",
  {
    id_mapping: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    id_pt: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    id_prodi: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    id_jurusan_sekolah: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    pt: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    prodi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    jurusan_sekolah: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    jenjang: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    tableName: "ref_mapping_jurusan_pt_prodi",
    timestamps: false,
  },
);

module.exports = RefMappingJurusanPtProdi;
