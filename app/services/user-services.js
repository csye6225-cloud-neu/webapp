import Account from '../models/account-model.js';
import bcrypt from 'bcrypt';

export const search = async (email) => {
    return await Account.findOne({ where: { email } });
}

export const post = async (data) => {
    const { firstName, lastName, email, password } = data;

    // Check for duplicate email
    const account = await search(email);
    if (account) {
        return "duplicate";
    }
    
    // Create a new account with create(); combines build() and save()
    const accountCreated = await Account.create({
        firstName,
        lastName,
        email,
        // hashedPassword,
        password,
        accountCreated: new Date(),
        accountUpdated: new Date()
    });
    return accountCreated;
};

export const update = async (id, data) => {
    const account = await Account.findByPk(id);
    if (account) {
        if (data.firstName) account.firstName = data.firstName;
        if (data.lastName) account.lastName = data.lastName;
        if (data.email) account.email = data.email;
        if (data.password) account.password = data.password;
        account.accountUpdated = new Date();
        await account.save();
        return account;
    }
    return "not found";
}

/**
 * Authenticate the user with the token-based authentication
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const authenticate = async (req, res, next) => {
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

    // Compare the password
    const match = await bcrypt.compare(password, account.password);
    if (!match) return "Unauthorized";

    return account;
};