import { setReponse } from "./response-handler.js";

export const search = async (req, res) => {
	// Handle HEAD requests
	if (req.method === "HEAD") return setReponse(res, 405); // Method Not Allowed
	try {
        // return 400 if content-type is present as it is likely that the request has a payload
        const contentType = req.headers['content-type'];
		// return 400 if query parameters are present
		const hasQuery = Object.keys(req.query).length > 0;
		if (contentType || hasQuery) throw new Error("Bad Request");

		setReponse(res, 200); // OK
	} catch (error) {
		console.error(error);
		if (error.message === "Bad Request") {
			setReponse(res, 400); // Bad Request
			return;
		}
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

export const notFound = async (req, res) => {
    try {
        setReponse(res, 404); // Not Found
    } catch (error) {
        console.error(error);
        setReponse(res, 503); // Service Unavailable
    }
}