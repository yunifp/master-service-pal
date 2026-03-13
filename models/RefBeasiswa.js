const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefBeasiswa = sequelize.define(
  "RefBeasiswa",
  {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      allowNull: false,
    },
    nama_beasiswa: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    informasi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_aktif: {
      type: DataTypes.ENUM("Y", "N"),
      allowNull: true,
      defaultValue: "N",
    },
    status_tutup_daftar: {
      type: DataTypes.ENUM("Y", "N"),
      allowNull: true,
      defaultValue: "N",
    },
    tanggal_mulai: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tanggal_selesai: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "ref_beasiswa",
    timestamps: false,
  }
);

module.exports = RefBeasiswa;
