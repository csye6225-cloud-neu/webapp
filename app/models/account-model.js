import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import bcrypt from "bcrypt";

const Account = sequelize.define(
	"Account",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4, // generate a UUIDv4 as the default value
			primaryKey: true,
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		is_verified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		timestamps: true,
		createdAt: "account_created",
		updatedAt: "account_updated",
	}
);

const saltRounds = 10;

Account.beforeBulkCreate(async (accounts) => {
	for (const account of accounts) {
		const salt = await bcrypt.genSalt(saltRounds);
		account.password = await bcrypt.hash(account.password, salt);
	}
});

Account.beforeCreate(async (account) => {
	const salt = await bcrypt.genSalt(saltRounds);
	account.password = await bcrypt.hash(account.password, salt);
});

Account.beforeUpdate(async (account) => {
	if (account.changed("password")) {
		const salt = await bcrypt.genSalt(saltRounds);
		account.password = await bcrypt.hash(account.password, salt);
	}
});

export default Account;
