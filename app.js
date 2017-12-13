var request = require('request');
request = request.defaults({jar: true});
var cheerio = require('cheerio');
var app = express();
const pRequest = require("promisified-request").create(request);
const fScraper = require("form-scraper");

// Hardcoded to Wikipedia English Main Page Search Form
const WEBFORM = fScraper.fetchForm("#searchform", "https://en.wikipedia.org/wiki/Main_Page", pRequest);


/** 
 * Starts the web crawler
 * @param { String } searchTerms
*/
function crawl(searchTerms) {
    
    var formDetails = { search: searchTerms};
    fScraper.submitForm(formDetails, fScraper.provideForm(formStructure), pRequest).then( function (response) {
        console.log(response.body);
    });
    
}

