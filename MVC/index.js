// Create a new instance of Express
// Create a Node.js based http server on port 3000
var express = require('express'),
app = express(),
server = require('http').createServer(app).listen(3000),
io = require('socket.io').listen(server);
	
// Import the engine file
var engine = require('./engine');


app.use('/', express.static(__dirname));

app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

//Start a new client session
io.sockets.on('connection', function(socket){
	console.log('new session');
	engine.startSession(io,socket);
});