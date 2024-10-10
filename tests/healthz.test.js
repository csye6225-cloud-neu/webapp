import request from "supertest";
import { expect } from "chai";
import { sequelize } from "../app/config/database.js";
import server from "../server.js";

describe("GET /healthz", function () {
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

	it("should return 200", async function () {
		const res = await request(server).get("/healthz");
		expect(res.status).to.equal(200);
	});

	it("should not have a content-type header", async function () {
		const res = await request(server).get("/healthz");
		expect(!res.headers.hasOwnProperty("content-type"));
	});

	it("should not have query parameters", async function () {
		const res = await request(server).get("/healthz?test=1");
		expect(res.status).to.equal(400);
	});

	it("should not accept HEAD requests", async function () {
		const res = await request(server).head("/healthz");
		expect(res.status).to.equal(405);
	});
});
