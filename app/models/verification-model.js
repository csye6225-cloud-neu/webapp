import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Account from "./account-model.js";

// may be removed
const Verification = sequelize.define("Verification", {
	user_id: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	token: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	expiry: {
		type: DataTypes.DATE,
		allowNull: true,
	},
});

Verification.belongsTo(Account, { foreignKey: "user_id", as: "user" });

export default Verification;
