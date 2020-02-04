
'use strict';

const userInterface = require('./ui-schema.js');
const Model = require('./model.js');

class UI extends Model {
  constructor() {
    super(userInterface);
  }
}

module.exports = new UI();