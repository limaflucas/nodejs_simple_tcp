'use strict'

const net = require('net');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '});

const PORT = 8081;
const ADDRESS = 'localhost';

class Server {
    
    constructor(port, address) {
	this.port = port  || PORT;
	this.address = address || ADDRESS;
	this.socket = net.createServer(this.onClientConnected);

	this.init();
    }

    init() {
	var server = this;		

	server.socket.listen(PORT, ADDRESS, function() {
	    console.log(`Server started at: ${ADDRESS}:${PORT}`);
	});
    }

    onClientConnected (sock) {	
	let clientName = `${sock.remoteAddress}:${sock.remotePort}`;
	
	console.log(`new client connected: ${clientName}`);
	
	sock.on('data', (data) => {
	    console.log(`client ${clientName} :: ${data}`);
	});
	
	sock.on('close', () => {
	    console.log(`connection from ${clientName} closed`);
	});
	
	sock.on('error', (err) => {
	    console.log(`Connection ${clientName} error: ${err.message}`);
	});
	
	rl.prompt();
	rl.on('line', (line) => {
	   sock.write(line.trim());
	    rl.prompt();
	}).on('close', () => {
	    console.log('ending readline');
	    sock.write('exit');
	    process.exit(0);
	});
    }
}
module.exports = Server;
