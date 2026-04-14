const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const CmsJalurPendaftaran = sequelize.define(
    "CmsJalurPendaftaran",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        urutan: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0,
            comment: "Urutan tampil kartu",
        },
        judul: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: "Nama jalur pendaftaran",
        },
        deskripsi: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "Deskripsi singkat jalur",
        },
        gambar_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: "Path gambar kartu",
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
        tableName: "cms_jalur_pendaftaran",
        timestamps: false,
    }
);

module.exports = CmsJalurPendaftaran;