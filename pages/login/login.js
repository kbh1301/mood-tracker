export const login = () => {
    const signInMenu = document.getElementById('sign-in-menu');
    signInMenu.onload = (event) => {
        signInMenu.setAttribute('width', event.target.contentWindow.document.body.scrollWidth)
        signInMenu.setAttribute('height', event.target.contentWindow.document.body.scrollHeight)
    };
}