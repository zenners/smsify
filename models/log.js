var mongoose = require('mongoose');

var smsSchema = new mongoose.Schema({
    any:{}
},
{
  timestamps : true
}
);

module.exports = smsSchema
