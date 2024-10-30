import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { cloudwatch } from "./aws.js";
import { PutMetricDataCommand } from "@aws-sdk/client-cloudwatch";

// Load environment variables
dotenv.config();

// Option 3: Passing parameters separately (other dialects)
export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	// Use the default database to test the connection
	host: process.env.DB_HOST,
	dialect: process.env.DB_DIALECT,
});

// Measure the duration of each query and send to CloudWatch
sequelize.addHook("beforeQuery", (options) => {
	options.startTime = Date.now();
});

sequelize.addHook("afterQuery", async (options) => {
	const duration = Date.now() - options.startTime;
	const command = new PutMetricDataCommand(
		{
			MetricData: [
				{
					MetricName: "DatabaseQuery_Duration",
					Dimensions: [{ Name: "Query", Value: options.type }],
					Unit: "Milliseconds",
					Value: duration,
				},
			],
			Namespace: "WebAppMetrics",
		},
		(err, data) => {
			if (err) console.error(err);
		}
	);
	try {
		await cloudwatch.send(command);
	} catch (error) {
		console.error("Error sending metrics to CloudWatch:", error);
	}
});
