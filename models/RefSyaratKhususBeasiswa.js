const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");
const RefJalur = require("./RefJalur");

const RefSyaratKhususBeasiswa = sequelize.define(
  "RefSyaratKhususBeasiswa",
  {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_jalur: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: RefJalur,
        key: "id",
      },
    },
    persyaratan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_aktif: {
      type: DataTypes.ENUM("Y", "N"),
      allowNull: true,
      defaultValue: "Y",
    },
    valid_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_required: {
      type: DataTypes.ENUM("Y", "N"),
      allowNull: true,
      defaultValue: "Y",
    },
    // ---- TAMBAHAN KOLOM BARU MULAI DI SINI ----
    is_kabkota: {
      type: DataTypes.ENUM("Y", "N"),
      allowNull: true,
      defaultValue: "N",
    },
    is_prov: {
      type: DataTypes.ENUM("Y", "N"),
      allowNull: true,
      defaultValue: "N",
    },
    // ---- TAMBAHAN KOLOM BARU SELESAI ----
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "ref_syarat_khusus_beasiswa",
    timestamps: false,
  }
);

RefSyaratKhususBeasiswa.belongsTo(RefJalur, { foreignKey: 'id_jalur', targetKey: 'id', as: 'jalur_ref' });

module.exports = RefSyaratKhususBeasiswa;