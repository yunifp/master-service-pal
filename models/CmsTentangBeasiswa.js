const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const CmsTentangBeasiswa = sequelize.define(
    "CmsTentangBeasiswa",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        judul_section: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: "Tentang Beasiswa",
            comment: "Judul section",
        },
        deskripsi: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
            comment: "Deskripsi lengkap program beasiswa (support HTML)",
        },
        gambar_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: "Gambar ilustrasi atau foto",
        },
        is_active: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: 1,
        },
        created_by: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        updated_by: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
    },
    {
        tableName: "cms_tentang_beasiswa",
        timestamps: false,
    }
);

module.exports = CmsTentangBeasiswa;