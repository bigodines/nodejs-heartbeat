var hb = require("./heartbeat.js");

// start a client and start pulsing every 5 seconds 
hb.client("127.0.0.1", 6688, 5000);