var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'airtableExpress',
    message: 'simple routes and views tutorial'
  });
});

router.get('/links', function(req, res, next) {
  res.render('links', {
    title: "learninglab links",
    message: 'here are your links:',
    links: [
      {
        text: 'Apple',
        url: 'http://www.apple.com'
      },
      {
        text: 'musicLab',
        url: 'http://musiclab.learninglab.xyz/'
      },
      {
        text: 'codelab',
        url: 'http://codelab.learninglab.xyz/'
      },
      {
        text: 'the Show',
        url: 'http://show.learninglab.xyz/'
      }
    ]
  })
})

module.exports = router;
