import express from "express";
import { Sequelize } from "sequelize";
import initializeRoutes from "./routes/index.js";

const initialize = async (app) => {
	app.use(express.json()); // Parse incoming JSON payloads

	// Option 3: Passing parameters separately (other dialects)
	const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
		// Use the default database to test the connection
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
	});

	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}

	app.use(async (req, res, next) => {
		try {
			// Check if the connection is alive by pinging the database
			await sequelize.query("SELECT 1");
			next(); // Continue if the connection is alive
		} catch (error) {
            console.error("Error pinging the database:", error);
			res.status(503).send();
		}
	});

	initializeRoutes(app);
};

export default initialize;
