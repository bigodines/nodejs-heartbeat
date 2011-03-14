var hb = require("../src/heartbeat.js");

exports.test_pulse = function(test) {
	var t, response, mock_socket;
	mock_socket = { 
		write : function(x) { 
			response = x; 
		}
	};
	
	t = hb.client("test_case", 0,0,true);
	t.pulse(mock_socket); // this will populate 'response'
	test.equal(response, "alive", "pulse() must write 'alive' to the socket");
	test.done();
};

exports.test_connect = function(test) {
	var t, mock_net, mock_socket, assert_count = 0, response;
	mock_socket = { 
		write : function(x) { 
			response = x; 
		},
		on : function(type, data) { 
		}
	};
	mock_net = {
		createConnection : function () { return mock_socket; }
	};

	t = hb.client("test_case", 0,0,true);
	t.connect(mock_net);
	test.equals('alive', response, "heartbeat must send a first message to the server");
	test.done();
};

exports.test_client_must_respond_to_any_data_when_alive = function(test) {
	var t, mock_net, mock_socket, assert_count = 0, response;
	mock_socket = { 
		write : function(x) { 
			response = x; 
		},
		on : function(x, cb) {
			if (x == "data")
				assert_count += 1;

			if (x == "connect")
			    return;
		}
	};
	mock_net = {
		createConnection : function () { return mock_socket; }
	};

	t = hb.client("test_case", 0,0,true);
	t.connect(mock_net); // still didnt find a way to mock setInterval()
	test.equals(1, assert_count, "client must bind something to the 'data' event");
	test.done();
};