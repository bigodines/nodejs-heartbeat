var hb = require("./heartbeat.js");


// start server with default values
var server = hb.server(); 

// run!!
setInterval(function() { server.detector(7000); }, 2*1000);