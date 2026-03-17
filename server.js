const express = require('express');
const http = require('http');
const { Chess } = require('chess.js') || { Chess: class { constructor() { this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; move() { return true; } } };

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const games = {};

server.listen(process.env.PORT || 3000);

io.on('connection', socket => {
  socket.on('join', room => socket.join(room));
  socket.on('move', ({room, move}) => {
    const game = games[room] || (games[room] = new Chess());
    if (game.move(move)) io.to(room).emit('fen', game.fen());
  });
});
