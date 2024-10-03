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
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
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
	},
	{
		timestamps: true,
		createdAt: "accountCreated",
		updatedAt: "accountUpdated",
	}
);

const saltRounds = 10;
Account.beforeCreate(async (account) => {
	const salt = await bcrypt.genSalt(saltRounds);
	account.password = await bcrypt.hash(account.password, salt);
	console.log(`**********account.password: ${account.password}`);
});

Account.beforeUpdate(async (account) => {
	if (account.changed("password")) {
		const salt = await bcrypt.genSalt(saltRounds);
		account.password = await bcrypt.hash(account.password, salt);
	}
});

export default Account;
