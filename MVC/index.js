var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	

// Import the moteur.js file
var moteur = require('./moteur');

server.listen(3000);

app.use('/', express.static(__dirname));

app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	console.log('new session');
	moteur.startSession(io, socket);
});







/*	
	socket.on('send message', function(data){
		console.log('new message');
		io.sockets.emit('new message', data);
	});

	socket.on('set update', function(data){
	    console.log('update');
	    io.sockets.emit('get update', data);
	});

	socket.on('set current slide', function(data){
	    console.log('set current slide');
	    io.sockets.emit('get current slide', data);
	});*/