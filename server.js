const express = require('express');
const { Server } = require('socket.io');
const { Chess } = require('chess.js');
const app = express();
const server = app.listen(process.env.PORT || 3000);
const io = new Server(server, { cors: { origin: "*" } });
const games = {};

io.on('connection', socket => {
  socket.on('join', room => socket.join(room));
  socket.on('move', ({room, move}) => {
    const game = games[room] || (games[room] = new Chess());
    if (game.move(move)) io.to(room).emit('fen', game.fen());
  });
});
