import StatsD from "hot-shots";

const statsd = new StatsD({
	host: "localhost",
	port: 8125,
	errorHandler: function (error) {
		console.log("Socket errors caught here: ", error);
	},
});

statsd.increment("test.connection.metric", 1);

export default statsd;