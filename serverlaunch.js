const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { Accounts } = require('./accountSchema.js');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const staticDir = path.join(__dirname);
app.use(express.static(staticDir));

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/getAccounts', async (req, res) => {
  try {
      await mongoose.connect("mongodb+srv://its0ll13:Password@drai.xj9hwyq.mongodb.net/Accounts");
      const accountsData = await Accounts.find({});
      res.json(accountsData);
  } catch (error) {
      console.error('Error retrieving accounts data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      mongoose.disconnect();
  }
});

app.post("/accountChange", async (req, res) => {
  try {
      await mongoose.connect("mongodb+srv://its0ll13:Password@drai.xj9hwyq.mongodb.net/Accounts");
      const { username, password, sQuestion, PD } = req.body;
      console.log(username);
      const existingAccount = await Accounts.findOne({ username });
      if (existingAccount) {
          existingAccount.password = password;
          const updatedAccount = await existingAccount.save();
          res.status(200).json({ message: "Account updated successfully", updatedAccount });
      } else {
          res.status(404).json({ error: "Account not found" });
      }
  } catch (error) {
      console.error("Error updating account:", error);
      res.status(500).json({ error: "Internal Server Error" });
  } finally {
      mongoose.disconnect();
  }
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
