import express from "express";
import * as userController from "../controllers/user-controller.js";

const router = express.Router();

router.route("/").post(userController.post) // Handle POST requests to /v1/user

router.route("/self")
    .get(userController.search) // Handle GET requests to /v1/user/self
    .put(userController.update) // Handle PUT requests to /v1/user/self
    .all(userController.notAllowed); // Handle all other requests to /v1/user/self

export default router;
