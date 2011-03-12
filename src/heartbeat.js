var net = require("net");
exports.client = function(host, port, pulse_interval/*, expert_mode=false*/) {
	var start_pulse, pulse, connect, socket;
	
	pulse = function(socket) {
		socket.write("alive", "utf8");
	};

	start_pulse = function(socket) {
		//	pulse(socket);
		setInterval(function() { pulse(socket); }, pulse_interval);
	};

	connect = function (net_interface) {
		try {
			socket = net_interface.createConnection(port, host);
			socket.on("connect", this.start_pulse(socket));
			
		} catch (x) {
			//		console.log(x);
			console.log("cant connect. try again");
		};
	};

	if (arguments[3] === undefined) { // default (lame) mode
	
		if (pulse_interval === undefined) {
			pulse_interval = 5*1000;	
		};
	
		connect(net);
	} 

	return {
		'pulse' : pulse,
		'start_pulse' : start_pulse,
		'connect' : connect
	};
}; // client

exports.server = function (host, port) {
	var clients = [];
	var detector;
	// detect dead machines
	detector = function(period) {
		var limit = new Date().getTime() - period;
		if (period === undefined) {
			period = 10*1000; // 10 seconds of tolerance between pulses
		};
		for (idx in clients) {
			var last_seen = clients[idx];
			console.log('comparing '+last_seen.hbtime+ 'with'+limit);
			if (last_seen.hbtime < limit) {
		 		console.log("machine down! --> "+last_seen.addr);			
			};
		};
	};
	
	if (host === undefined) {
		host = "127.0.0.1";
	};
	
	if (port === undefined) {
		port = 6688;
	};
	
	net.createServer(function(socket) {
						 socket.setEncoding("utf8");
						 socket.on("data", function(data) {
									   clients[socket.remoteAddress] = {'addr':socket.remoteAddress, 'hbtime':new Date().getTime()};
								   });
					 }).listen(port, host);
	
	return { 
		'detector' : detector
	};
}; // server

