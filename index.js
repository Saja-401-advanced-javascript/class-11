
'use strict';

const server = require('./auth/server.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const MONGOOSE_URI='mongodb://localhost:27017/Auth';

dotenv.config();

mongoose.connect(MONGOOSE_URI, { useNewUrlParser: true, useCreateIndex:true,useUnifiedTopology:true });

server.start();