var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/copy', function(req, res, next) {
  res.render('copy-paste');
});

router.get('/blank', function(req, res, next) {
  res.render('blank');
})
module.exports = router;
