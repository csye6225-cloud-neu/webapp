import StatsD from "hot-shots";

const statsd = new StatsD({
	host: "localhost",
	port: 8125,
    prefix: "webapp.",
	errorHandler: function (error) {
		console.log("Socket errors caught here: ", error);
	},
});

export default statsd;