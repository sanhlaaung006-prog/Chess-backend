const express = require('express');
const { Server } = require('socket.io');
const { Chess } = require('chess.js');
const app = express();
const server = app.listen(process.env.PORT || 3000);
const io = new Server(server, { cors: { origin: "*" } });
const games = {};

io.on('connection', socket => {
  socket.on('join', ({room, name = 'Anonymous'} = {}) => {
    socket.join(room);
    if (!games[room]) {
      games[room] = { 
        chess: new Chess(), 
        players: {}, 
        turn: 'w' 
      };
    }
    games[room].players[socket.id] = name;
    io.to(room).emit('players', Object.values(games[room].players));
  });
  
  socket.on('move', ({room, from, to, promotion = 'q'}) => {
    const game = games[room];
    if (game && game.chess.move({from, to, promotion})) {
      io.to(room).emit('fen', game.chess.fen());
    }
  });
});
