'use strict';

const net = require('net');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '});

const PORT = 8081;
const HOST = 'localhost';
 
class Client {
    constructor(port, address) {
	this.socket = new net.Socket();
	this.address = address || HOST;
	this.port = port || PORT;

	this.init();
    }
    
    init() {
	var client = this;
	
	client.socket.connect(client.port, client.address, () => {
	    console.log(`Client connected to: ${client.address} :  ${client.port}`);
	});
	
	client.socket.on('data', (data) => {
	    console.log(`server :: ${data}`);
	    if (data.toString().endsWith('exit')) {
		client.socket.destroy();
	    }
	});
	
	client.socket.on('close', () => {
	    console.log('Client closed');
	});
	
	client.socket.on('error', (err) => {
	    console.error(err);
	});
    }

    typeText() {
	rl.prompt();
	rl.on('line', (line) => {
	    this.sendText(line.trim());
	    rl.prompt();
	}).on('close', () => {
	    console.log('ending readline');
	    process.exit(0);
	});
    }

    sendText(message) {
	var client =this;
	client.socket.write(message);
    }
}
module.exports = Client;
