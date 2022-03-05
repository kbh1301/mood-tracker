const routes = {};
const pageFunctions = {};

// function used to get file name of pages js
const getScriptName = () => pages.indexOf(document.currentScript.src.substr(document.currentScript.src.lastIndexOf('/')+1).slice(0, -3))

// for every page in pages array:
// 1. generate path for js files and append to head
// 2. generate path for html files and add to routes object
// 3. generate path for css files and append to head
for (const page of pages) {
    const directory = './pages/';
    const dirPath = (extension, page) => directory + page + extension;

    // 1. pages scripts
    const script = document.createElement("script");
    script.src = dirPath('.js', page);
    document.getElementById("loadPages").after(script);
    
    // 2. pages hmtl
    Object.assign(routes, {[page]: dirPath('.html', page)})

    // 3. pages css
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = dirPath('.css', page);
    document.getElementById("global-stylesheet").after(link);
}
// load router js after page scripts
const script = document.createElement("script");
script.src = "./js/router.js";
document.head.appendChild(script);