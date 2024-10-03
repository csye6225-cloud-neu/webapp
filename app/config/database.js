import { Sequelize } from "sequelize";

// Option 3: Passing parameters separately (other dialects)
export const sequelize = new Sequelize('user', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	// Use the default database to test the connection
	host: process.env.DB_HOST,
	dialect: process.env.DB_DIALECT,
});
