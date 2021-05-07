
const path     = require('path');
const http     = require('http');
const socket   = require('./socket');
const express  = require('express');
const students = require('./students');
const groups   = require('./groups');
const absPath  = relative => path.resolve(__dirname, relative);

// Create the server
const app    = express();
const server = http.Server(app);

// Start the socket
socket(server);

// Register static endpoints
app.use('/student', express.static(absPath('../clients/student/dist')));
app.use('/teacher', express.static(absPath('../clients/teacher/dist')));

// Expose data endpoints
app.get('/data/students', (req, res) => res.json(students));
app.get('/data/groups', (req, res) => res.json(groups));

server.listen(8000, () => {
    console.log('TBS: listening on http://localhost:8000');
});