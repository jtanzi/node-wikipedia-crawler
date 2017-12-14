

const urlBase = "https://en.wikipedia.org";

/*
* Makes call to crawler on server application
* Appends a list item for every Wikipedia search result it gets back
*/
function crawl() {
    // Clear the results-list area of any existing list items from previous execution
    document.getElementById('results-list').innerHTML = "";

    // On response, parse out the array of objects into list items with links
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.response);

            if(results.length > 0) {
                results.forEach(element => {
                    var li = document.createElement("li");
                    var a = document.createElement('a');
                    var linkText = document.createTextNode(element.heading);
                    a.appendChild(linkText);
                    a.href = urlBase + element.link;
                    a.title = element.heading;
                    li.appendChild(a);
                    document.getElementById('results-list').appendChild(li);
                });
            } else {
                var noResultsText = document.createElement('p');
                noResultsText.classList.add("no-results-text");
                noResultsText.innerText = "Sorry, Wikipedia didn't have any articles to show you from your search.  Try again!"
                document.getElementById('results-section').appendChild(noResultsText);
            }

       }
    };

    var searchTerms = document.getElementById('search-box').value;  // Grab the text in the search box at time it was clicked

    // Make the HTTP request
    xhttp.open("GET", "/" + searchTerms, true);
    xhttp.send();

}