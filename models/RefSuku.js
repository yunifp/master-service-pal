const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");

const RefSuku = sequelize.define(
    "RefSuku",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nama_suku: {
            type: DataTypes.STRING(100),
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
        },
    },
    {
        tableName: "ref_suku",
        timestamps: false,
    }
);

module.exports = RefSuku;