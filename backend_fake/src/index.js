const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

const userSockets = new Map();

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('identify', (userId) => {
        if (!userId) return;
        const set = userSockets.get(String(userId)) || new Set();
        set.add(socket.id);
        userSockets.set(String(userId), set);
        socket.data.userId = String(userId);
        console.log(`User ${userId} associated with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
        const uid = socket.data.userId;
        if (uid) {
            const set = userSockets.get(uid);
            if (set) {
                set.delete(socket.id);
                if (set.size === 0) userSockets.delete(uid);
            }
        }
        console.log('Socket disconnected:', socket.id);
    });
});

module.exports = { server, io, userSockets };

server.listen(3001, () => {
    console.log("API lógica y sockets en http://localhost:3001");
});
