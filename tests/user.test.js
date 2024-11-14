import request from "supertest";
import { expect } from "chai";
import { sequelize } from "../app/config/database.js";
import server from "../server.js";
import { bootstrapDatabase } from "../app/app.js";
import { Verification, Account } from "../app/models/index.js";

describe("POST /v1/user", function () {
	before(async function () {
		try {
			await sequelize.authenticate();
		} catch (error) {
			console.error("Unable to connect to the database during tests", error);
			throw error;
		}
	});
	after(async () => {
		server.close();
	});

	it("should create a new user and return 201", async () => {
		const user = {
			first_name: "John",
			last_name: "Doe",
			email: "user@example.com",
			password: "password123",
		};
		const res = await request(server).post("/v1/user").send(user);
		expect(res.status).to.equal(201);
		expect(res.body).to.have.property("id");
		expect(res.body.email).to.equal(user.email);
	});

	it("should return 400 if email is duplicated", async () => {
		const user = {
			first_name: "John1",
			last_name: "Doe1",
			email: "user@example.com",
			password: "password",
		};
		await Account.update({ is_verified: true }, { where: { email: "user@example.com" } });
		const res = await request(server).post("/v1/user").send(user);
		expect(res.status).to.equal(400);
	});
});

describe("GET /verify", function () {
	let verification;
	const email = "jjj@gmail.com";
	before(async function () {
		try {
			await sequelize.authenticate();
			await bootstrapDatabase();

			const user = await Account.findOne({ where: { email } });
			const expiry = new Date().setMinutes(new Date().getMinutes() + 2);
			verification = await Verification.create({
				user_id: user.id,
				email,
				token: "123456",
				created_at: new Date(),
				expiry: expiry,
			});
		} catch (error) {
			console.error("Unable to connect to the database during tests", error);
			throw error;
		}
	});
	after(async () => {
		server.close();
	});

	it("should verify the user", async () => {
		const res = await request(server).get("/verify").query({ token: verification.token });
		console.log('**************', res)
		expect(res.status).to.equal(200);

		const user = await Account.findOne({ where: { email: verification.email } });
		expect(user.is_verified).to.equal(true);
	});
});

describe("PUT verified /v1/user/self", () => {
	before(async function () {
		await sequelize.authenticate();
		await bootstrapDatabase();
		await Account.update({ is_verified: true }, { where: { email: "jdoe@email.com" } });
	});
	after(async () => {
		server.close();
	});

	it("should update user information", async () => {
		const userUpdate = {
			first_name: "Jane",
			last_name: "Smith",
		};
		const email = "jdoe@email.com";
		const password = "123456";
		const token = getBasicAuthToken(email, password);

		const res = await request(server).put("/v1/user/self").send(userUpdate).set("Authorization", `${token}`);
		expect(res.status).to.equal(204);
	});
});

describe("PUT unverified /v1/user/self", () => {
	before(async function () {
		await sequelize.authenticate();
		await bootstrapDatabase();
	});
	after(async () => {
		server.close();
	});

	it("should update user information", async () => {
		const userUpdate = {
			first_name: "Jane",
			last_name: "Smith",
		};
		const email = "jdoe@email.com";
		const password = "123456";
		const token = getBasicAuthToken(email, password);

		const res = await request(server).put("/v1/user/self").send(userUpdate).set("Authorization", `${token}`);
		expect(res.status).to.equal(403);
	});
});

describe("GET verified /v1/user/self", () => {
	before(async function () {
		await sequelize.authenticate();
		await bootstrapDatabase();
		await Account.update({ is_verified: true }, { where: { email: "jdoe@email.com" } });
	});
	after(async () => {
		server.close();
	});

	it("should get user information", async () => {
		const email = "jdoe@email.com";
		const password = "123456";
		const token = getBasicAuthToken(email, password);

		const res = await request(server).get("/v1/user/self").set("Authorization", `${token}`);
		expect(res.status).to.equal(200);
		expect(res.body).to.have.property("id");
		expect(res.body.email).to.equal(email);
	});

	it("should return 401 if the token is missing", async () => {
		const res = await request(server).get("/v1/user/self");
		expect(res.status).to.equal(401);
	});
});

function getBasicAuthToken(username, password) {
	const credentials = `${username}:${password}`;
	const base64Credentials = Buffer.from(credentials).toString("base64");
	return `Basic ${base64Credentials}`;
}
