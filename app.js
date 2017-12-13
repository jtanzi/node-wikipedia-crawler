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
});

app.get('/:searchTerms', function(req, res) {  // Button click on home page

    // Crawl the search form on the page
    console.log(req.params);
    var formDetails = { search: req.params.searchTerms };

    fScraper.submitForm(formDetails, fScraper.provideForm(WEBFORM), pRequest).then( function (response) {
        // console.log(response.body);
        var $ = cheerio.load(response.body);

        var responseArr = [];

        // Start parsing out DOM elements and formatting them into the JSON array (responseArr)
        $('.mw-search-result-heading a').filter(function() {
            var json = { heading: "", link: "" };
            var data = $(this);
            console.log(data.attr('title'));
            json.heading = data.attr('title');
            json.link = data.attr('href');
            responseArr.push(json);
        });

        console.log(responseArr);
        res.send(response.body);
    });
});



app.listen(3000, () => console.log('App listening on port 3000.'));

/* SERVER END */