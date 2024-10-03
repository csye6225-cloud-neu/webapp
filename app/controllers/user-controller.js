import { setReponse, setReponseWithData } from "./response-handler.js";
import * as userService from "../services/user-services.js";

export const search = async (req, res) => {
    if (req.method === "HEAD") return setReponse(res, 405); // Method Not Allowed
	try {
		const result = await userService.authenticate(req, res);
        if (result === "Unauthorized") return setReponse(res, 401); // Unauthorized

		setReponseWithData(res, 200, result); // OK
	} catch (error) {
        console.log(error)
		setReponse(res, 503); // Service Unavailable
	}
};

export const update = async (req, res) => {
	try {
		const res1 = await userService.authenticate(req, res);
        if (res1 === "Unauthorized") return setReponse(res, 401); // Unauthorized
        console.log(res1)
		const result = await userService.update(res1.id, {...req.body});
		if (result === "not found") return setReponse(res, 404); // Not Found
		setReponseWithData(res, 204, result); // No Content
	} catch (error) {
        console.log(error)
		setReponse(res, 503); // Service Unavailable
	}
};

export const post = async (req, res) => {
	try {
		const result = await userService.post(req.body);
		if (result === "duplicate") return setReponse(res, 400); // Bad Request
		setReponseWithData(res, 201, result); // Created
	} catch (error) {
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

