const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefNpsn = sequelize.define(
    "RefNpsn",
    {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        sekolah: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        npsn: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        jenis_sekolah: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        id_jenjang: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "ref_npsn",
        timestamps: false, // karena table tidak punya created_at & updated_at
        freezeTableName: true,
        charset: "latin1",
        collate: "latin1_swedish_ci",
        engine: "InnoDB",
    }
);

module.exports = RefNpsn;