const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefFlowBeasiswa = sequelize.define(
  "RefFlowBeasiswa",
  {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    flow: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ket: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "ref_flow_beasiswa",
    timestamps: false,
  }
);

module.exports = RefFlowBeasiswa;
