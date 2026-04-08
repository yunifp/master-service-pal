const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefWilayah = sequelize.define(
  "RefWilayah",
  {
    wilayah_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    parent: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    children: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    nama_wilayah: {
      type: DataTypes.CHAR(255),
      allowNull: true,
    },
    usulan_nama: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: "",
    },
    tingkat: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    tingkat_label: {
      type: DataTypes.ENUM(
        "provinsi",
        "kabupaten",
        "kota",
        "kecamatan",
        "kelurahan",
        "desa"
      ),
      allowNull: false,
      defaultValue: "kelurahan",
    },
    kode_pro: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
    },
    kode_kab: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    kode_kec: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    kode_kel: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    singkatan: {
      type: DataTypes.CHAR(32),
      allowNull: true,
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    lon: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    wilayah_3t: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: true,
      defaultValue: '0',
    },
    wilayah_perbatasan: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: true,
      defaultValue: '0',
    },
    wilayah_papua_nusateng: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: true,
      defaultValue: '0',
    }
  },
  {
    tableName: "ref_wilayah",
    timestamps: false,
  }
);

module.exports = RefWilayah;
