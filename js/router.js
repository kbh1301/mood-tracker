// checks if discard confirmation box needs to be created when routing
const isDiscarded = (event) => {
    var entryPaths = ['ratings', 'notes']
    
    // if current path is included in entryPaths and target button is navigation,
    // create confirmation dialogue box
    if(entryPaths.includes(urlPath) && event.target.parentElement.id == 'nav-btns') {
        if(confirm("Discard current entry?")) {
            initialState();
            return true;
        } else {
            return false;
        }
    }
    return true
}

// this function controls routing functionality
const route = (event, path) => {
    if(isDiscarded(event)) {
        event = event || window.event;
        event.preventDefault();
        window.history.pushState(null, null, path);
        handleLocation();
    }
};

// this function retrieves and inserts route html to container then executes related js
const handleLocation = () => {
    window.urlPath = Object.keys(routes).find(name => window.location.pathname.includes(name)) || pages[0];
    const route = routes[urlPath];

    // fetch page html
    fetch(route)
    // convert to text
    .then(data => data.text())
    // insert it into container
    .then(html => document.getElementById("page").innerHTML = html)
    // execute associated js for this page
    .then(() => pageFunctions[urlPath]());
};

window.onpopstate = handleLocation;
handleLocation();