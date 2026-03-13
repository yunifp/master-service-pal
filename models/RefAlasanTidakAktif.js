const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefAlasanTidakAktif = sequelize.define(
  "RefAlasanTidakAktif",
  {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "ref_alasan_tidak_aktif",
    timestamps: false,
  },
);

module.exports = RefAlasanTidakAktif;
