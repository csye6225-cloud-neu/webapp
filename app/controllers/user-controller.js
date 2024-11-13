import { setReponse, setReponseWithData } from "./response-handler.js";
import * as userService from "../services/user-services.js";

export const search = async (req, res) => {
	if (req.method === "HEAD") return setReponse(res, 405); // Method Not Allowed
	try {
		const result = await userService.authenticate(req, res);
		if (result === "Unauthorized") return setReponse(res, 401); // Unauthorized
		const { password, ...resultWithoutPassword } = result.dataValues;

		setReponseWithData(res, 200, resultWithoutPassword); // OK
	} catch (error) {
		console.log(error);
		if (error.message.includes("Forbidden")) return setReponseWithData(res, 403, "Please verify your account."); // Forbidden
		setReponse(res, 503); // Service Unavailable
	}
};

export const update = async (req, res) => {
	try {
		const res1 = await userService.authenticate(req, res);
		if (res1 === "Unauthorized") return setReponse(res, 401); // Unauthorized

		// check if contains any other fields
		const allowedFields = ["first_name", "last_name", "password"]; // Fields allowed to be updated

		// Extract fields from the request body
		const updateFields = Object.keys(req.body);

		// Check if all fields in the request are allowed
		const isValidUpdate = updateFields.every((field) => allowedFields.includes(field));

		if (!isValidUpdate) return setReponse(res, 400); // Bad Request

		const result = await userService.update(res1.id, { ...req.body });
		const { password, ...resultWithoutPassword } = result.dataValues;
		if (result === "not found") return setReponse(res, 404); // Not Found
		setReponseWithData(res, 204, resultWithoutPassword); // No Content
	} catch (error) {
		console.log(error);
		if (error.message.includes("Forbidden")) return setReponseWithData(res, 403, "Please verify your account."); // Forbidden
		setReponse(res, 503); // Service Unavailable
	}
};

export const post = async (req, res) => {
	try {
		const result = await userService.post(req.body);

		// if the user already exists in the database and is verified
		if (result === "duplicate") return setReponse(res, 400); // Bad Request

		// if the user does not exist in the database or is not verified
		await userService.publishVerificationMessage(result);

		const { password, ...resultWithoutPassword } = result.dataValues;
		setReponseWithData(res, 201, resultWithoutPassword); // Created
	} catch (error) {
		if (error.message === "SequelizeValidationError") return setReponse(res, 400); // Bad Request
		console.error(error);
		setReponse(res, 503); // Service Unavailable
	}
};

export const notAllowed = async (req, res) => {
	try {
		setReponse(res, 405); // Method Not Allowed
	} catch (error) {
		console.error(error);
		setReponse(res, 503); // Service Unavailable
	}
};
