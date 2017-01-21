var express = require('express');
var axios = require('axios')
var router = express.Router();
var crypto = require('crypto')
var key = require('../secret')

var mongoose = require('mongoose');
var smsSchema = require('../models/log');

var Sms  = mongoose.model('Sms', smsSchema);

var querystring = require('querystring');

var url = 'https://post.chikka.com/smsapi/request'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

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

function verifyShopifyHook(req) {
    var digest = crypto.createHmac('SHA256', SECRET)
            .update(new Buffer(req.body, 'utf8'))
            .digest('base64');

    return digest === req.headers['X-Shopify-Hmac-Sha256'];
}

function handleRequest(req, res) {
    if (verifyShopifyHook(req)) {
        res.writeHead(200);
        res.end('Verified webhook');
    } else {
        res.writeHead(401);
        res.end('Unverified webhook');
    }
}




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
  console.log(req.headers)

  // build object for request
  var obj = {
    message_type: 'SEND',
    mobile_number: '639174036834', //change this
    shortcode: '29290787', // use your shortcode
    message_id: randomGen(5), // dont generate something too long
    message: 'sendnudes', // encodeUriComponent(str) this for longer messages
    client_id: key.chika_client_id,
    secret_key: key.chika_secret,
  }

  axios.post(url, obj)
    .then((data) =>{
      console.log(data.data)
      res.send(obj)
    })
    .catch((err) => {
      console.log(err)
      res.send('eror')
    })


})

router.post('/ordercreated', function(req,res,next){
  console.log(req.headers)

  var msg = `Hi ${req.body.customer.first_name} ${req.body.customer.last_name}, we received your order `
  console.log(msg)
  var obj = {
    message_type: 'SEND',
    mobile_number: '639174036834', //change this
    shortcode: '29290787', // use your shortcode
    message_id: randomGen(5), // dont generate something too long
    message: msg, // encodeUriComponent(str) this for longer messages
    client_id: key.chika_client_id,
    secret_key: key.chika_secret,
  }
  axios.post(url, querystring.stringify(obj))
    .then((data) =>{
      console.log(data.data)
      res.send(obj)
    })
    .catch((err) => {
      console.log(err)
      res.send('eror')
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
