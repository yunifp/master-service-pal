const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const CmsJalurDokumen = sequelize.define(
    "CmsJalurDokumen",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        id_jalur: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        dokumen: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: "Nama / deskripsi dokumen",
        },
        urutan: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: "cms_jalur_dokumen",
        timestamps: false,
    }
);

module.exports = CmsJalurDokumen;