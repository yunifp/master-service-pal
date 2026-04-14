const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const CmsKontak = sequelize.define(
    "CmsKontak",
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
            defaultValue: "Kontak",
        },
        nama_instansi: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: "Nama instansi / kantor",
        },
        alamat: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "Alamat lengkap",
        },
        telepon: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: "Nomor telepon",
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: true,
            comment: "Alamat email",
        },
        whatsapp: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: "Nomor WhatsApp (opsional)",
        },
        jam_operasional: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: "Jam operasional",
        },
        maps_embed_url: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "URL embed Google Maps iframe src",
        },
        maps_lat: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
            comment: "Latitude untuk pin peta",
        },
        maps_lng: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true,
            comment: "Longitude untuk pin peta",
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
        tableName: "cms_kontak",
        timestamps: false,
    }
);

module.exports = CmsKontak;