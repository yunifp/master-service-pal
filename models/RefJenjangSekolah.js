const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefJenjangSekolah = sequelize.define(
  "RefJenjangSekolah",
  {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    jenjang: {
      type: DataTypes.ENUM("SMA", "SMK", "MA", "Ponpes"),
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "ref_jenjang_sekolah",
    timestamps: false,
  },
);

module.exports = RefJenjangSekolah;
