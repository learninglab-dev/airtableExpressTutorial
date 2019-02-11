var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'airtableExpress' });
});

router.get('/test', function(req, res, next) {
  var result = putStringsTogether("My first string!", "my second string!");
  res.render('index', { title: result });
});

function putStringsTogether(string1, string2) {
  return (string1 + " and " + string2);
}

module.exports = router;
