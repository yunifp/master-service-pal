const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefPenghasilan = sequelize.define(
  "RefPenghasilan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Di code kita panggilnya rentang_penghasilan, tapi di DB nembak ke nama_pekerjaan
    rentang_penghasilan: {
      type: DataTypes.STRING(100), // Sesuaiin panjang varchar di DB lo (biasanya 50/100)
      allowNull: false,
      field: "nama_pekerjaan" // <--- Ini kunciannya biar sinkron sama DB lo!
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
    tableName: "ref_penghasilan",
    timestamps: false,
  }
);

module.exports = RefPenghasilan;