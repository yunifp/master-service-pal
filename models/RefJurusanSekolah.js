const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefJurusanSekolah = sequelize.define(
  "RefJurusanSekolah",
  {
    id_jurusan_sekolah: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_jenjang_sekolah: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    jurusan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "ref_jurusan_sekolah",
    timestamps: false,
  },
);

module.exports = RefJurusanSekolah;
