import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import statsd from "./statsd.js";

// Load environment variables
dotenv.config();

// Option 3: Passing parameters separately (other dialects)
export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	// Use the default database to test the connection
	host: process.env.DB_HOST,
	dialect: process.env.DB_DIALECT,
});

// Measure the duration of each query
sequelize.addHook("beforeQuery", (options) => {
	options.startTime = Date.now();
});

sequelize.addHook("afterQuery", async (options) => {
	const duration = Date.now() - options.startTime;
	statsd.timing("db.query.time", duration);
	statsd.increment("db.query.count");
});