import express from "express";
import * as healthzController from "../controllers/healthz-controller.js";

const router = express.Router();

router.route("/")
    .get(healthzController.search) // Handle GET requests to /healthz
    .all(healthzController.notAllowed); // Catch other methods

export default router;
