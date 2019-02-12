var express = require('express');
var router = express.Router();
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('appOIWWkZBV8iXa8i');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'airtableExpress',
    message: 'simple routes and views tutorial'
  });
});

router.get('/links', function(req, res, next) {
  base('Pages').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 50,
    view: "Grid view"
}).firstPage().then( records => {
    console.log(JSON.stringify(records, null, 4));
    var dataForClient = [];
    records.forEach(record => {
      dataForClient.push({
        name: record.fields.Name,
        url: ("/pages/" + record.fields.pathBasename),
        notes: record.fields.Notes
      })
    })
    res.render('links', {
      title: "learninglab links",
      message: 'here are your links:',
      links: dataForClient
    })
}, function done(err) {
    if (err) { console.error(err); return; }
});
})

module.exports = router;
