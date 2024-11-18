import { Account, Verification } from "../models/index.js";
import bcrypt from "bcrypt";
import { PublishCommand } from "@aws-sdk/client-sns";
import { snsClient } from "../config/aws.js";

export const search = async (email) => {
	return await Account.findOne({ where: { email } });
};

export const post = async (data) => {
	const { first_name, last_name, email, password } = data;

	// Check for duplicate email
	const account = await search(email);
	if (account) {
		// Check if the account is verified
		if (account.is_verified) return "duplicate";
		return account;
	}

	// Create a new account with create(); combines build() and save()
	const accountCreated = await Account.create({
		first_name,
		last_name,
		email,
		password,
		accountCreated: new Date(),
		accountUpdated: new Date(),
	});
	return accountCreated;
};

export const update = async (id, data) => {
	const account = await Account.findByPk(id);
	if (account) {
		if (data.first_name) account.first_name = data.first_name;
		if (data.last_name) account.last_name = data.last_name;
		if (data.email) account.email = data.email;
		if (data.password) account.password = data.password;
		account.accountUpdated = new Date();
		await account.save();
		return account;
	}
	return "not found";
};

/**
 * Authenticate the user with the token-based authentication
 * @param {Request} req
 * @param {Response} res
 */
export const authenticate = async (req, res) => {
	const { authorization } = req.headers;
	if (!authorization) {
		res.set("WWW-Authenticate", 'Basic realm="User Visible Realm"');
		return "Unauthorized";
	}

	const token = authorization.split(" ")[0] === "Basic" ? authorization.split(" ")[1] : null;
	if (!token) {
		res.set("WWW-Authenticate", 'Basic realm="User Visible Realm"');
		return "Unauthorized";
	}

	// Decode the token
	const credentials = Buffer.from(token, "base64").toString("utf-8");
	const [email, password] = credentials.split(":");

	// Find the user by email
	const account = await search(email);
	if (!account) return "Unauthorized";

	if (!account.is_verified) throw new Error("Forbidden");

	// Compare the password
	const match = await bcrypt.compare(password, account.password);
	if (!match) return "Unauthorized";

	return account;
};

export const publishVerificationMessage = async (account) => {
	const { id, email } = account;
	const verificationToken = await bcrypt.hash(`${id}${email}`, 10);
	const expiry = new Date().setMinutes(new Date().getMinutes() + 2);

	// Save the verification token in the database for new users
	await Verification.upsert({ user_id: id, email, token: verificationToken, expiry });

	// Publish the verification message to the SNS topic
	const message = {
		Message: JSON.stringify({ id, email, token: verificationToken, timestamp: new Date().toISOString() }),
		TopicArn: process.env.SNS_TOPIC_ARN,
	};

	return await snsClient.send(new PublishCommand(message));
};
