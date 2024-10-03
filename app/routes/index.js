import express from "express";
import healthzRoute from "./healthz-route.js";
import userRoute from "./user-route.js";

const initializeRoutes = (app) => {

	app.use('/healthz', healthzRoute);
	app.use('/v1/user', userRoute);
    // app.all("/*", healthzController.notFound); // Catch all other endpoints
};

export default initializeRoutes;
