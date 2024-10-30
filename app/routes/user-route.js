import express from "express";
import * as userController from "../controllers/user-controller.js";
import * as picsController from "../controllers/pics-controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }).single("profilePic");

router.route("/")
    .post(userController.post) // Handle POST requests to /v1/user
    .all(userController.notAllowed); // Handle all other requests to /v1/user

router.route("/self")
    .get(userController.search) // Handle GET requests to /v1/user/self
    .put(userController.update) // Handle PUT requests to /v1/user/self
    .all(userController.notAllowed); // Handle all other requests to /v1/user/self

router.route("/self/pic")
    .post(upload, picsController.postPic)
    .get(picsController.getPic)
    .delete(picsController.deletePic)
    .all(userController.notAllowed);

export default router;
