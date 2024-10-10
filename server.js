import express from "express";
import initialize from "./app/app.js";

// Create an express app
const app = express();
initialize(app);

const port = process.env.PORT || 3000;

// Start the server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Export the app for testing
export default server;