const { DataTypes } = require("sequelize");
const { sequelize } = require("../core/db_config");


const RefAgama = sequelize.define(
    "RefAgama",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nama_agama: {
            type: DataTypes.STRING(50),
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
        tableName: "ref_agama",
        timestamps: false,
    }
);

module.exports = RefAgama;