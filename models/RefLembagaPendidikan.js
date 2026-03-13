const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefLembagaPendidikan = sequelize.define(
  "RefLembagaPendidikan",
  {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "ref_lembaga_pendidikan",
    timestamps: false,
  },
);

module.exports = RefLembagaPendidikan;
