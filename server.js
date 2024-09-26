import dotenv from "dotenv";
import express from "express";
import initialize from "./app/app.js";

// Load environment variables
dotenv.config();

// Create an express app
const app = express();
initialize(app);

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});