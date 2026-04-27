const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join a specific room based on role if needed
    socket.on('join', ({ role, userId }) => {
      socket.join(role);
      console.log(`User ${userId} joined room ${role}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export default socketHandler;
