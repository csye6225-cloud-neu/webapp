import express from "express";
import { verify } from "../controllers/verify-controller.js";

const router = express.Router();

router.get("/", verify);

export default router;
