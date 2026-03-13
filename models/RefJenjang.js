const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefJenjang = sequelize.define(
  "RefJenjang",
  {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
  },
  {
    tableName: "ref_jenjang",
    timestamps: false,
  },
);

module.exports = RefJenjang;
