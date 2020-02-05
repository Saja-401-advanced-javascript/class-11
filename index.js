
'use strict';

const server = require('./auth/server.js');
const mongoose = require('mongoose');
require('dotenv').config();


const MONGOOSE_URI='mongodb://localhost:27017/Auth';


mongoose.connect(MONGOOSE_URI, { useNewUrlParser: true, useCreateIndex:true,useUnifiedTopology:true });

server.start();