// Modules
const http = require('http');
const express = require('express');
require('dotenv').config({path: './.env'})

// Routes
const routes = require('./routes/routes');

// Error Handler
const errorHandler = require('./errors/errorHandler');

const server = express();
http.createServer(server);

server.use(express.json())
server.use(routes);
server.use(errorHandler);

server.listen(process.env.API_PORT, () => {
    console.log(`Server started in ${process.env.API_PORT} port.`);
})