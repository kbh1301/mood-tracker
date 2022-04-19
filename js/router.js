// TODO: clean this up into something like:
// pages.forEach(page => import { <urlPath> } from `../pages/${urlPath}`) etc
import { initialState } from './state.js';
import { getUsername, handleUnauthorizedUser} from './auth.js';
import { dashboard } from '../pages/dashboard/dashboard.js';
import { entries } from '../pages/entries/entries.js';
import { login } from '../pages/login/login.js';
import { notes } from '../pages/notes/notes.js';
import { ratings } from '../pages/ratings/ratings.js';
const imported = {
    dashboard: dashboard,
    entries: entries,
    login: login,
    notes: notes,
    ratings: ratings
};

// array for every pagename in page folder
const pages = ['ratings', 'notes', 'dashboard', 'entries', 'login'];
// login page is being called an additional time?
for (const page of pages) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `./pages/${page}/${page}.css`;
    document.getElementById("global-stylesheet")?.after(link);
};

// search for match from page array and pathname; return page or default to first in array
const getUrlPath = () => pages.find(page => window.location.pathname.includes(page)) || pages[0];

// checks if discard confirmation box needs to be created when routing
const isDiscarded = () => {
    if(confirm("Discard current entry?")) {
        return true;
    } else {
        return false;
    }
};

// this function retrieves and inserts route html to container then executes related js
export const loadPageContainer = (path) => {
    path = path ? path : getUrlPath();
    
    const directory = `./pages/${path}/`;
    const dirPath = (extension) => directory + path + extension;

    const route = dirPath('.html');

    // fetch page html
    fetch(route)
    // convert to text
    .then(data => data.text())
    // insert it into container
    .then(html => document.getElementById("page").innerHTML = html)
    // execute associated js for this page
    .then(() => imported[path]());
};

// this function controls routing functionality
export const route = async (event, intendedPath) => {
    // if route is not login, verify user authorization
    if(intendedPath != 'login') {
        await handleUnauthorizedUser();
        // if username set to null after authorization, break route
        if(getUsername() == '') return;
    };

    const currentLocation = getUrlPath();
    let urlPath = intendedPath == 'login' ? '' : intendedPath;
    let pathname = intendedPath;
    var entryPaths = ['ratings', 'notes'];

    // based on conditions, create entry discard confirmation box
    if(entryPaths.includes(currentLocation) && event.target.parentElement?.id == 'nav-btns') {
        if(isDiscarded()) {
            initialState();
        } else {
            urlPath = '';
            pathname = '';
        }; 
    };

    event = event || window.event;
    event.preventDefault();

    // if urlPath exists, update window's url
    if(urlPath) window.history.pushState(null, null, `./${urlPath}`);

    // load specific page html and js based on pathname
    loadPageContainer(pathname);
};

// when dom is loaded, call route process
window.onload = (event) => route(event);

// when window's url is changed or refreshed, call route process
window.onpopstate = (event) => route(event);

// when localStorage token is changed, call route process; triggers from userMenu onSubmit
window.addEventListener('storage', (event) => {
    if(event.key === 'token') route(event);
});