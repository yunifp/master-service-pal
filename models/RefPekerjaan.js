const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config"); // Sesuaikan path db_config lo

const RefPekerjaan = sequelize.define(
  "RefPekerjaan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_pekerjaan: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "Y",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "ref_pekerjaan",
    timestamps: false, // Kita handle timestamp manual sesuai DB
  }
);

module.exports = RefPekerjaan;