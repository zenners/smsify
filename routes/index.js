var express = require('express');
var axios = require('axios')
var router = express.Router();
var crypto = require('crypto')
var key = require('../secret')

var mongoose = require('mongoose');
var smsSchema = require('../models/sms');

var Sms  = mongoose.model('Sms', smsSchema);

var url = 'https://post.chikka.com/smsapi/request'

// utility functions, move somewhere else

function randomGen(bytes){
  return crypto.randomBytes(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
}

function cellReplace(num){
  var newNum = num.split('')
  if(newNum[0] == '0'){
    newNum[0] = '63'
    var z = newNum.join('')
    return z
  } 
  return num
};





/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.body)
  res.send(req.body)
});

router.post('/orders', function(req, res, next) {
  console.log(req.body)
  res.send(req.body)

  if (req.body.gateway == 'Bank Deposit'){
  	var url = 'http://api.semaphore.co/api/sms -d "api=qEC9rs3dXqSmbt4QBJG3&number=[YOUR NUMBER]&message=test"'
  	axios.post(url, {})
  	  .then((res) =>{ console.log(res) })
  	  .catch((err) => {console.log(err)})
  }
});

router.get('/sms', function(req,res,next){
  console.log(req.body)

  // build object for request
  var obj = {
    message_type: 'SEND',
    mobile_number: '639174036834',
    shortcode: '29290787',
    message_id: randomGen(10),
    message: 'hello world',
    client_id: key.chika_client_id,
    secret_key: key.chika_secret,
  }

  
  
  axios.post(url, obj)
    .then((res) =>{
      console.log(res.data)
      res.send(obj)
    })
    .catch((err) => {
      console.log(err)
    })


})

router.post('/delivery', function(req,res,next){
  if (req.body.message_type == "OUTGOING"){
    //just dump into mongodb
      Sms.save(req.body, function(err, res){
        if(err) console.log(err)

        res.send('saved')
      })
       
  }
})

module.exports = router;
