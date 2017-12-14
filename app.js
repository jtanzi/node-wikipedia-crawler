// Globals
var request = require('request');
request = request.defaults({jar: true});
var cheerio = require('cheerio');
const express = require('express');
const app = express();
const path = require('path');
const pRequest = require("promisified-request").create(request);
const fScraper = require("form-scraper");

// Hardcoded to Wikipedia English Main Page Search Form
const WEBFORM = fScraper.fetchForm("#searchform", "https://en.wikipedia.org/wiki/Main_Page", pRequest);


/* SERVER START */

// Server options
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));

app.get('/favicon.ico', function(req, res) {  // Catches and handles brower request for favicon.ico
    res.status(204);
    res.send("No favicon for you!");
});

app.get('/:searchTerms', function(req, res) {  // Button click on home page

    // Crawl the search form on the page
    var formDetails = { search: req.params.searchTerms };
    var responseArr = [];

    fScraper.submitForm(formDetails, fScraper.provideForm(WEBFORM), pRequest).then( function (response) { 

        var $ = cheerio.load(response.body);

        // Start parsing out DOM elements and formatting them into the JSON array (responseArr)
        $('.mw-search-result-heading a').filter(function() {
            var json = { heading: "", link: "" };
            var data = $(this);

            json.heading = data.attr('title');
            json.link = data.attr('href');
            responseArr.push(json);
        });

        res.send(responseArr);

    });

});

app.listen(3000, () => console.log('App listening on port 3000.'));

/* SERVER END */