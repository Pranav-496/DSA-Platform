let queue = [];
let activeMatches = new Map();

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('⚡ User connected to Socket: ', socket.id);

    socket.on('join_matchmaking', (userProfile) => {
      console.log(`User ${userProfile.name} joined queue`);
      
      // If queue has someone, match them!
      if (queue.length > 0) {
        const opponent = queue.shift();
        const matchId = `match_${opponent.socketId}_${socket.id}`;
        
        const matchData = {
          matchId,
          player1: opponent,
          player2: { socketId: socket.id, ...userProfile },
          status: 'in_progress',
          startTime: Date.now()
        };
        
        activeMatches.set(matchId, matchData);
        
        socket.join(matchId);
        io.sockets.sockets.get(opponent.socketId)?.join(matchId);
        
        io.to(matchId).emit('match_found', matchData);
      } else {
        // Otherwise wait in queue
        queue.push({ socketId: socket.id, ...userProfile });
        socket.emit('waiting_for_match');
      }
    });

    socket.on('code_update', ({ matchId, code }) => {
      // Broadcast code update to the other player
      socket.to(matchId).emit('opponent_code_update', { code });
    });

    socket.on('disconnect', () => {
      queue = queue.filter(u => u.socketId !== socket.id);
      console.log('User disconnected: ', socket.id);
    });
  });
};
