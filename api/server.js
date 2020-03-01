const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('../middleware/logger');
const router = require('./router');

const server = express();
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(logger);
server.use('/api', router);

module.exports = server;
