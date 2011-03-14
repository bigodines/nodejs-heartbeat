var net = require("net");
exports.client = function(host, port/*, expert_mode=false*/) {
	var pulse, connect, socket;
	
	pulse = function(socket) {
		socket.write("alive", "utf8");
	};

	connect = function (net_interface) {
		socket = net_interface.createConnection(port, host);
		socket.write("alive", "utf8");
		socket.on("error", function(x) {
					  //		console.log(x);
					  console.log("cant connect. try again");
				  });
		socket.on("data", function() { pulse(socket); });

	};

	if (arguments[3] === undefined) { // default (lame) mode
		connect(net);
	} 

	return {
		'pulse' : pulse,
		'connect' : connect
	};
}; // client

exports.server = function (host, port/*, net*/) {
	var net_interface = net, clients = [], zombies = [];
	var find_zombies, start_server, ask_many, broadcast;
	// detect dead machines
	find_zombies = function(period, zombie_callback) {
		var zombies = [],limit = new Date().getTime() - period;
		if (period === undefined || period === null) {
			period = 60*1000; // default is 60 seconds of tolerance between pulses
		};
		for (idx in clients) {
			var last_seen = clients[idx];
			if (last_seen.hbtime < limit) {
				zombie_callback(last_seen);
				zombies.push(last_seen);
			};
		};
		return zombies;
	};

	start_server = function() {
		net_interface.createServer(function(socket) {
									   var got_data = function(data) {
										   clients[socket.remoteAddress] = {'addr':socket.remoteAddress, 
																				 'hbtime':new Date().getTime(), 
																				 'socket': socket};
									   };
									   socket.setEncoding("utf8");
									   socket.on("data", got_data);
								   }).listen(port, host);
	};

	/*send heartbeat message to many clients*/
	ask_many = function(clients) {
		var c;
		for (idx in clients) {
			c = clients[idx];
			try {
				c.socket.write("are u alive");
			} catch (x) {
				console.log("couldnt send message to: "+c.addr+" waiting for it to die");
			}
		};

	};
	
	/*broadcast heartbeat message*/
	broadcast = function() {
		ask_many(clients);
	};

	if (arguments[2] !== undefined) {
		net_interface = arguments[2];
	}
	
	if (host === undefined) {
		host = "127.0.0.1";
	};
	
	if (port === undefined) {
		port = 6688;
	};
	
	start_server();
	
	return { 
		'find_zombies' : find_zombies,
		'ask_many' : ask_many,
		'broadcast' : broadcast,
		/*public for testing*/
		'clients' : clients,
		'zombies' : zombies
	};
}; // server

