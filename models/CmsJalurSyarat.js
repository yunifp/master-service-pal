const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const CmsJalurSyarat = sequelize.define(
    "CmsJalurSyarat",
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
        syarat: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: "Deskripsi satu syarat",
        },
        urutan: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: "cms_jalur_syarat",
        timestamps: false,
    }
);

module.exports = CmsJalurSyarat;