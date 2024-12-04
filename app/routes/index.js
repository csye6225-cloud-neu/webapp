import healthzRoute from "./healthz-route.js";
import userRoute from "./user-route.js";
import verifyRoute from "./verify-route.js";

const initializeRoutes = (app) => {

	app.use('/healthz', healthzRoute);
	app.use('/cicd', healthzRoute);
	app.use('/v1/user', userRoute);
	app.use('/verify', verifyRoute);
    // app.all("/*", healthzController.notFound); // Catch all other endpoints
};

export default initializeRoutes;
