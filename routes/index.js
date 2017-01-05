var express = require('express');
var axios = require('axios')
var router = express.Router();
var crypto = require('crypto')
var key = require('../secret')

function randomGen(bytes){
  return crypto.randomBytes(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
}



var url = 'https://post.chikka.com/smsapi/request'

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

module.exports = router;
