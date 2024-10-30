import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Image = sequelize.define(
    "Image",
    {
        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
            readOnly: true,
        },
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            readOnly: true,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            readOnly: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            readOnly: true,
        },
    },
    {
        timestamps: true,
        createdAt: "upload_date",
        updatedAt: false,
    }
);

export default Image;