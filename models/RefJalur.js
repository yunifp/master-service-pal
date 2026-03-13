const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefJalur = sequelize.define(
  "RefJalur",
  {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    jalur: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "ref_jalur",
    timestamps: false,
  }
);

module.exports = RefJalur;
