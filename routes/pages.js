var express = require('express');
var router = express.Router();
var Airtable = require('airtable');
var chalk = require('chalk');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('appOIWWkZBV8iXa8i');

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  base('Pages')
    .select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 50,
    view: "Grid view"
    })
    .firstPage()
    .then( records => {
        console.log(JSON.stringify(records, null, 4));
        var dataForClient = [];
        records.forEach(record => {
          dataForClient.push({
            name: record.fields.Name,
            url: ("/pages/" + record.fields.pathBasename),
            notes: record.fields.Notes
          })
        })
        return dataForClient;
    }, function done(err) {
        if (err) { console.error(err); return; }
    })
    .then( data => {
      console.log("going to render these:");
      console.log(chalk.cyan(JSON.stringify(data, null, 4)));
      res.render('links', {
        title: "the pages",
        message: 'here are your links:',
        links: data
      })
    },
    function done(err) {
        if (err) { console.error(err); return; }
    });
});

router.get('/:page', function(req, res, next) {
  console.log("going to look for resources for " + req.params.page);
    base('Pages').select({
    filterByFormula: ('pathBasename="' + req.params.page + '"'),
    maxRecords: 5
    })
    .firstPage()
    .then( async function(records){
      console.log("found some records!");
      console.log(records.length);
      if (records.length > 1) {
        console.log("there may be a double-entry problem here");
      };
      if (records.length == 1) {
        console.log("great--just one record");
      }
      var pageData = {
        title: records[0].get('Name'),
        topText: records[0].get('topText'),
        bottomText: records[0].get('bottomText'),
        resourceIds: records[0].get('resources'),
        Notes: records[0].get('Notes'),
        resources: []
      };
      if (pageData.resourceIds.length > 0) {
        for (var i = 0; i < pageData.resourceIds.length; i++) {
          console.log("looking for " + pageData.resourceIds[i]);
          var newResource = await getRecord(base('Resources'), pageData.resourceIds[i]);
          var youTubeEmbedUrl = newResource.fields.Type.includes('YouTube') ? ("https://www.youtube.com/embed/" + youtube_parser(newResource.fields.URL)) : "NA"
          pageData.resources.push(
            {
              name: newResource.fields.Name,
              type: newResource.fields.Type,
              id: newResource.fields.id,
              linkText: newResource.fields.LinkText,
              notes: newResource.fields.notes,
              URL: newResource.fields.URL,
              youTubeEmbedUrl: youTubeEmbedUrl
            }
          );
        }
      }
    // let's go check Airtable for that page's resources
    return pageData
    },
    function done(error) {
    })
    .then(pageData => {
          res.render('page', {data: pageData});
      console.log("about to render a page with ");
      console.log(chalk.red(JSON.stringify(pageData, null, 4)));

    })
    .catch(err => {
      console.log(err);
    });
})

async function getRecord(theTable, id) {
  console.log("starting getRecord");
  var theResult = await theTable.find(id).then(result => {
    console.log('got result');
    console.log(JSON.stringify(result, null, 4));
    return result
  });
  return theResult;
}





module.exports = router;
