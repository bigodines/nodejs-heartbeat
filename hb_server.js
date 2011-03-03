var hb = require("./heartbeat.js");


// start server with default values
hb.server(); 

// run!!
setInterval(function() { hb.detector(7000); }, 2*1000);