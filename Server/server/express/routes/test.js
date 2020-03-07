var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('You are testing!');
});

router.get('/cookies', function(req, res, next) {
  if (req.cookies.isFirst) {
    res.send("welcome, my old friend");
    console.log(req.cookies)
  } else {
      res.cookie('isFirst', 1, { maxAge: 60 * 1000});
      res.send("welcome, my new friend");
  }
});

router.get('/signedcookies', function(req, res, next) {
  if (req.signedCookies.isFirst) {
    res.send("welcome, my old friend. You're using signed cookies");
    console.log(req.signedCookies)
  } else {
      res.cookie('isFirst', 1, { maxAge: 60 * 1000, signed: true});
      res.send("welcome, my new friend. You're using signed cookies");
  }
});

router.get('/session', function(req, res, next) {
  if(req.session.isFirst || req.cookies.isFirst) {
      res.send("welcome, my old friend.");
      console.log(req.session);
  } else {
      req.session.isFirst = 1;
      // res.cookie('isFirst', 1, { maxAge: 60 * 1000, singed: true});
      res.send("welcome, my new friend.");
  }
});


module.exports = router;
