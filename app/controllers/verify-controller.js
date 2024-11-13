import * as verifyServices from "../services/verify-services.js";
import { setReponseWithData, setReponse } from "./response-handler.js";

export const verify = async (req, res) => {
	console.log("GET /verify", req.query);
	const token = req.query.token;
	const user = await verifyServices.findUserByToken(token);

	if (!user) {
        return setReponseWithData(res, 400, "Invalid token.");
	}

    if (user.user.is_verified) {
        return setReponseWithData(res, 400, "Email already verified.");
    }

	if (new Date() > user.expiry) {
        return setReponseWithData(res, 400, "Verification link has expired.");
	}

	// Mark user as verified
    try {
        await verifyServices.updateUserVerificationStatus(user.user_id, true);
    } catch (error) {
        console.error(error);
        return setReponse(res, 503);
    }
    setReponseWithData(res, 200, "Email verified successfully!");
};