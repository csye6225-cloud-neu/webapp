import * as healthzController from "../controllers/healthz-controller.js";

const initializeRoutes = (app) => {
	app.get('/healthz', healthzController.search); // Handle GET requests to /healthz
	app.all("/healthz", healthzController.notAllowed); // Catch other methods
    app.all("/*", healthzController.notFound); // Catch all other endpoints
};

export default initializeRoutes;
