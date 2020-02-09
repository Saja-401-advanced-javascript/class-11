
'use strict';

require('dotenv').config();
const server = require('./auth/server.js');
const mongoose = require('mongoose');


const MONGOOSE_URI = 'mongodb://localhost:27017/LAB11';


mongoose.connect(MONGOOSE_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

server.start();


