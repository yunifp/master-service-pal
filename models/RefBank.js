const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefBank = sequelize.define(
  "RefBank",
  {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    bank: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    kode_bank: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "ref_bank",
    timestamps: false,
  },
);

module.exports = RefBank;
