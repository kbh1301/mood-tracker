// creates and animates user menu iframe
export const userMenuDropdown = () => {
    // if user-menu doesn't exist, create and render
    if (!document.getElementById("user-menu")) {
        event.stopPropagation();
        const userMenu = document.createElement("iframe");
        userMenu.setAttribute('id', 'user-menu');
        userMenu.setAttribute('src', './components/userMenu.html');
        // animate opacity and slide based on iframe size
        userMenu.style.opacity = 0;
        userMenu.onload = () => {
            userMenu.style.top = "-" + event.target.contentWindow.document.body.scrollHeight + "px";
            userMenu.setAttribute('width', event.target.contentWindow.document.body.scrollWidth)
            userMenu.setAttribute('height', event.target.contentWindow.document.body.scrollHeight)
            userMenu.style.top = 0;
            userMenu.style.opacity = 1;
        };
        // prepend user-menu to content div
        document.getElementById('content').prepend(userMenu);

        // destroy user-menu when clicking outside of it
        window.addEventListener('click', () => {
            // remove after closing animations are complete
            userMenu.addEventListener('transitionend', () => userMenu.remove());
            userMenu.style.top = "-" + userMenu.offsetHeight + "px";
        }, {once: true});
    }
};