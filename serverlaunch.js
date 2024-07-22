const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const { Accounts } = require("./accountSchema.js");
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const staticDir = path.join(__dirname);
app.use(express.static(staticDir));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('accountNew', async (data) => {
        try {
          await mongoose.connect("mongodb+srv://its0ll13:Password@drai.xj9hwyq.mongodb.net/Accounts");
          const { newuname, newPword, newsAnswer } = data;
          const newAccount = new Accounts({
            username: newuname,
            password: newPword,
            sQuestion: newsAnswer,
            PD: []
          });
          await newAccount.save();
          io.emit('accountCreated', { message: 'Account created successfully' });
        } catch (error) {
            console.error("Error creating account:", error);
            io.emit('accountCreationError', { error: 'Internal Server Error' });
        } finally {
            mongoose.disconnect();
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
