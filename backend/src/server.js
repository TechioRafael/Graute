// Modules
const http = require('http');
const express = require('express');
require('dotenv').config({path: './.env'})

// Routes
const usersRoutes = require('./routes/usersRoutes');

// Error Handler
const errorHandler = require('./errors/errorHandler');

const server = express();
http.createServer(server);


server.use(usersRoutes);
server.use(errorHandler);


server.listen(process.env.API_PORT, () => {
    console.log(`Server started in ${process.env.API_PORT} port.`);
})