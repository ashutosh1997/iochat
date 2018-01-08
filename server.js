var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('...Server Running...');

app.get('/', function (request, response) {
	response.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
	
	//Connect
	connections.push(socket);
	console.log('Connected: %s connections connected', connections.length);

	//Disconnect
	socket.on('disconnect', function (data) {
		// if (!socket.username) return;
		users.splice(users.indexOf(socket.username), 1);

		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s connections connected', connections.length);
	});

	//Send message
	socket.on('send message', function (data) {
		// console.log(data);
		io.sockets.emit('new message', {msg:data, user:socket.username});
	});

	//New user
	socket.on('new user', function (data, callback) {
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
})