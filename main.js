
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

const fs = require('fs');
var five = require("johnny-five");
var board = new five.Board({ port: 'COM4' });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});



board.on('ready', () => {

    const motor = new five.Motor({
        pins: {
          pwm: 8,
          dir: 9
        }
      });


    io.on("connection", socket => {
        
        console.log('Conectado!');

        socket.on("ligarMotor", (data) => {
            console.log(data);
            motor.forward(data);
        });

        socket.on("desligar", (data) => {
            motor.stop();
        });

    })


});

console.log("ouvindo porta 3000..");
server.listen(3000);