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
	var t, mock_net, mock_socket, assert_count = 0;
	mock_socket = { 
		write : function(x) { 
			response = x; 
		},
		on : function() { 
			assert_count += 1;
		}
	};

	mock_net = {
		createConnection : function () { return mock_socket; },
	};
	t = hb.client("test_case", 0,0,true);
	t.connect(mock_net);
	test.equals(1, assert_count, "heartbeat must bing the connect event")
	test.done();
};

exports.test_connect_must_trigger_start_pulse = function(test) {
	var t, mock_net, mock_socket, assert_count = 0;
	mock_socket = { 
		write : function(x) { 
			response = x; 
		}
	};

	mock_net = {
		createConnection : function () { return mock_socket; },
	};
	t = hb.client("test_case", 0,0,true);
//	t.connect(mock_net); // still didnt find a way to mock setInterval()
	test.done();
};