
const socketIO = require('socket.io');

module.exports = function (server) {
    const io       = socketIO(server);
    const hogwarts = io.of('/hogwarts');

    hogwarts.on('connection', function(socket) {
        console.log(`TBS: ${socket.client.id} connected to Hogwarts School of Magic`);

        // Listeners
        socket.on('join', roomId => socket.join(roomId));
        socket.on('leave', roomId => socket.leave(roomId));
        socket.on('broadcast', broadcast);
    });

    function broadcast(data) {
        data.rooms.forEach(roomId => {
            console.log(`TBS: sending message to ${roomId}: ${data.message}`);
            hogwarts.to(roomId).emit('message', data.message);
        });
    }
};