var hb = require("./heartbeat.js");

// start server with default values
var server = hb.server(); 

// run!!
setInterval(function() { 
				server.broadcast();
				server.find_zombies(15000, function(zombie) {
										console.log("Found a zombie: "+zombie.hbtime);
									}); }, 
			2*1000);