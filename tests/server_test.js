var hb = require("../src/heartbeat.js");

exports.test_server_creates_a_server = function(test) {
    var t, mock_net, assert_count = 0;
	mock_net = {
		createServer : function() { 
			assert_count += 1; 
			return {
				'listen' : function() {}
			};
		}
	};	
	t = hb.server('test',123, mock_net);
	t.find_zombies = function() { return; };
	test.equals(1, assert_count);
	test.done();
};

exports.test_ask_many_to_single_client = function(test) {
	var s, clients = [], mock_net, mock_socket, assert_count =0;
	mock_socket = { 
		remoteAddress : '0.0.0.0',
		write : function(x) { 
			assert_count += 1;
		}
	};
	mock_net = {
		createServer : function() { 
			return {
				'listen' : function() {}
			};
		}
	};	

	clients['0.0.0.0'] = {'addr':'0.0.0.0','socket':mock_socket};
	s = hb.server('test',123, mock_net);
	s.ask_many(clients);
	test.equals(1, assert_count);
	test.done();
};

exports.test_ask_many = function(test) {
	var s, clients = [], mock_net, mock_socket, assert_count =0, c1, c2;
	mock_socket = { 
		remoteAddress : '0.0.0.0',
		write : function(x) { 
			assert_count += 1;
		}
	};
	mock_net = {
		createServer : function() { 
			return {
				'listen' : function() {}
			};
		}
	};	
	clients['0.0.0.0'] = {'addr':'0.0.0.0','socket':mock_socket};
	clients['1.1.1.1'] = {'addr':'1.1.1.1','socket':mock_socket};
	s = hb.server('test',123, mock_net);
	s.ask_many(clients);
	test.equals(2, assert_count);
	test.done();
};

exports.test_find_zombies = function(test) {
	var s, clients = [], mock_net, mock_socket, assert_count =0;
	mock_socket = { 
		remoteAddress : '0.0.0.0',
		write : function(x) { 
			assert_count += 1;
		}
	};
	mock_net = {
		createServer : function() { 
			return {
				'listen' : function() {}
			};
		}
	};	
	clients['0.0.0.0'] = {'addr':'0.0.0.0','hbtime':new Date().getTime() ,'socket':mock_socket};
	clients['1.1.1.1'] = {'addr':'1.1.1.1','hbtime':new Date().getTime()-9999999,'socket':mock_socket};
	s = hb.server('test',123, mock_net);
	s.clients = clients;
	s.find_zombies(100, function() {
					   assert_count += 1;
				   });
	test.equals(1, assert_count);
	test.done();

};