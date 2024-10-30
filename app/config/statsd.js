import StatsD from 'hot-shots';

const statsd = new StatsD({
    host: "localhost",
    port: 8125
});

export default statsd;