const express = require('express');
const axios = require('axios');
const path = require('path');
const mongoose = require('mongoose');
const { Accounts } = require('./accountSchema.js');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(session({
    secret: 'your-secret-key', // Change this to a random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

let loggedInUsers = {};
const staticDir = path.join(__dirname);
app.use(express.static(staticDir));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://its0ll13:Password@drai.xj9hwyq.mongodb.net/Accounts", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/getAccounts', async (req, res) => {
    try {
        const accountsData = await Accounts.find({});
        res.json(accountsData);
    } catch (error) {
        console.error('Error retrieving accounts data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/accountChange", async (req, res) => {
    try {
        const { username, password, sQuestion, PD } = req.body;
        console.log(username);
        const existingAccount = await Accounts.findOne({ username });
        if (existingAccount) {
            existingAccount.password = password;
            existingAccount.sQuestion = sQuestion;
            existingAccount.PD = PD;
            const updatedAccount = await existingAccount.save();
            res.status(200).json({ message: "Account updated successfully", updatedAccount });
        } else {
            res.status(404).json({ error: "Account not found" });
        }
    } catch (error) {
        console.error("Error updating account:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/submitSymptoms', async (req, res) => {
    try {
        const pythonServerResponse = await axios.post('http://python-server:5000/submitSymptoms', req.body);
        res.json(pythonServerResponse.data);
    } catch (error) {
        console.error('Error communicating with Python server:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/loginSuccess', (req, res) => {
    const { username } = req.body;
    if (username) {
        req.session.username = username;
        loggedInUsers[username] = true;
        io.emit('userLoggedIn', { username: username });
        res.status(200).json({ message: 'Username received successfully' });
    } else {
        res.status(400).json({ error: 'Invalid username' });
    }
});

app.post('/logout', (req, res) => {
    if (req.session.username) {
        delete loggedInUsers[req.session.username];
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: 'Failed to logout' });
            }
            res.status(200).json({ message: 'Logged out successfully' });
        });
    } else {
        res.status(400).json({ error: 'No user to logout' });
    }
});

app.get('/loggedInUsers', (req, res) => {
    res.json(Object.keys(loggedInUsers));
});

function requireLogin(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

app.get('/protectedPage', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'protectedPage.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('accountNew', async (data) => {
        try {
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
