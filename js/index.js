const userMenuDropdown = () => {
    const userMenuGet = document.getElementById("user-menu");
    if (!userMenuGet) {
        const userMenu = document.createElement("iframe");
        userMenu.setAttribute('id', 'user-menu')
        userMenu.setAttribute('src', './../components/userMenu.html');
        userMenu.style.opacity = 0;
        userMenu.onload = () => {
            userMenu.style.top = "-" + event.target.contentWindow.document.body.scrollHeight + "px";
            userMenu.setAttribute('width', event.target.contentWindow.document.body.scrollWidth)
            userMenu.setAttribute('height', event.target.contentWindow.document.body.scrollHeight)
            userMenu.style.top = 0;
            userMenu.style.opacity = 1;
        };
        document.getElementById('content').prepend(userMenu);
    } else {
        userMenuGet.addEventListener('transitionend', () => userMenuGet.remove());
        userMenuGet.style.top = "-" + userMenuGet.offsetHeight + "px";
    }
}