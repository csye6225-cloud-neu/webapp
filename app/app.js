import express from "express";
import initializeRoutes from "./routes/index.js";
import { sequelize } from "./config/database.js";

const initialize = async (app) => {
	app.use(express.json()); // Parse incoming JSON payloads

	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}

	// bootstrap the database
	try {
		await sequelize.sync({force: true});
		console.log("All models were synchronized successfully.");

		// Bootstrap the database with some dummy data
		if ((await sequelize.models.Account.count()) === 0) {
			await sequelize.models.Account.bulkCreate([
				{
					firstName: "John",
					lastName: "Doe",
					email: "jjj@gmail.com",
					password: "password",
				},
				{
					firstName: "Jane",
					lastName: "Doe",
					email: "jdoe@email.com",
					password: "123456",
				},
			]);
			console.log("Database bootstrapped with initial users");
		}
	} catch (error) {
		console.error("Unable to synchronize the database:", error);
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