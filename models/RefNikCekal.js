const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefNikCekal = sequelize.define(
    "RefNikCekal",
    {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nik: {
            type: DataTypes.STRING(16),
            allowNull: false,
            // defaultValue: "Y" <-- Dihapus karena salah kaprah
        },
        nama: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        tahun: { // ✅ Kolom Baru: Tahun
            type: DataTypes.STRING(4),
            allowNull: true,
        },
        keterangan: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        is_aktif: { // ✅ Kolom Baru: Status Aktif (Y = Ceklis / Aktif Cekal)
            type: DataTypes.ENUM("Y", "N"),
            allowNull: false,
            defaultValue: "Y",
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "ref_nik_cekal",
        timestamps: false, // Kita manual handle created_at dan updated_at
    }
);

module.exports = RefNikCekal;