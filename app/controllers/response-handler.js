/*
 * setReponse function is used to set the response status and headers - no payload
 * @param {object} res - response
 * @param {number} status - status code
 * @returns {void}
 */
export const setReponse = (res, status) => {
	res.status(status);
	res.set("Cache-Control", "no-cache, no-store, must-revalidate;"); // Disable caching
    res.set("Pragma", "no-cache");
	res.send();
};
