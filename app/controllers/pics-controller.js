import { setReponse, setReponseWithData } from "./response-handler.js";
import { authenticate } from "../services/user-services.js";
import * as picsService from "../services/pics-services.js";

export const postPic = async (req, res) => {
	try {
		// Authenticate the user
		const result = await authenticate(req, res);
		if (result === "Unauthorized") return setReponse(res, 401); // Unauthorized

		// Check if the image is present
		const image = req.file;
		if (!image) return setReponse(res, 400); // Bad Request

		// Post the pic
		const result1 = await picsService.postPic(result.id, image);
		if (result1 === "duplicate") return setReponse(res, 400); // Bad Request

		setReponseWithData(res, 201, result1.dataValues); // Created
	} catch (error) {
		console.error(error);
		if (error.message.includes("Forbidden")) return setReponseWithData(res, 403, "Please verify your account."); // Forbidden
		setReponse(res, 503); // Service Unavailable
	}
};

export const getPic = async (req, res) => {
	if (req.method === "HEAD") return setReponse(res, 405); // Method Not Allowed
	try {
		// Authenticate the user
		const result = await authenticate(req, res);
		if (result === "Unauthorized") return setReponse(res, 401); // Unauthorized

		// Get the pic
		const result1 = await picsService.getPic(result.id);
		if (result1 === "not found") return setReponse(res, 404); // Not Found

		setReponseWithData(res, 200, result1.dataValues); // OK
	} catch (error) {
		console.error(error);
		if (error.message.includes("Forbidden")) return setReponseWithData(res, 403, "Please verify your account."); // Forbidden
		setReponse(res, 503); // Service Unavailable
	}
};

export const deletePic = async (req, res) => {
	try {
		// Authenticate the user
		const result = await authenticate(req, res);
		if (result === "Unauthorized") return setReponse(res, 401); // Unauthorized

		// Delete the pic
		const result1 = await picsService.deletePic(result.id);
		if (result1 === "not found") return setReponse(res, 404); // Not Found

		setReponse(res, 204); // No Content
	} catch (error) {
		console.error(error);
		if (error.message.includes("Forbidden")) return setReponseWithData(res, 403, "Please verify your account."); // Forbidden
		setReponse(res, 503); // Service Unavailable
	}
};
