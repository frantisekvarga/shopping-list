// Other imports
const express = require('express');
const mongoose = require('mongoose');
const http = require('http'); 
const bodyParser = require('body-parser');
const listRoutes = require('./routes/listRoutes');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');

const cors = require('cors');

const socketIo = require('socket.io');
require('dotenv').config();

const app = express();

const server = http.createServer(app);


app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true 
}));


const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST'], 
        credentials: true 
    }
});

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB connection successful');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); 
    }
};


app.use((req, res, next) => {
    req.io = io; 
    next();
});

app.use('/api/lists', listRoutes);
app.use('/api/user', userRoutes);
app.use('/api/items', itemRoutes);


io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const startServer = async () => {
    await connectDB();
    const PORT = process.env.PORT || 5030;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
