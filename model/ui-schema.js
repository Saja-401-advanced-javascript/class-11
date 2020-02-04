'use strict';

const mongoose = require('mongoose');

const userInterface = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('userInterface', userInterface);