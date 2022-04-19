// import { DateTime } from '../js/libs/luxon.js';
import { fetchPath } from '../config.js';
import { now, dateTransferFormat } from '../js/dates.js';
import { usernameState, updateUser } from '../js/state.js';

const loginInput = document.getElementById("login-input");
const userDisplay = document.getElementById("username-display");
const toggleHide = () => document.querySelectorAll(".toggle-hide").forEach(elm => elm.classList.toggle("hidden"));

if(!localStorage.getItem("token")) toggleHide();

userDisplay.innerText = usernameState;





// function to handle user logins
const authenticateUser = async (body) => {
    const errorMsg = document.getElementById("error-msg");
    
    try {
        // call server to drop current Demo data and generate new data based on current date
        if(body.username == 'Demo') {
            const yesterday = now().plus({ days:-1 });

            body = {
                ...body,
                ...dateTransferFormat(yesterday),
            };
        };
        const res = await fetch(`${fetchPath}/users/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });

        const data = await res.json();

        // display error to user
        if(res.status != 200) {
            errorMsg.innerText = `\u26A0 ${data}`;
            errorMsg.classList.remove("hidden");
            errorMsg.style.top = -errorMsg.offsetHeight;
            return;
        };

        // store jwt token and username as session variables
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('username', body.username);

        // // post user input to parent's user state
        updateUser(body.username);
        // reset user menu elements
        toggleHide();
        errorMsg.classList.add("hidden");
        userDisplay.innerText = body.username;
        // reset form
        loginInput.reset();
        
    } catch (err) {
        console.trace(err + '\nError connecting to server');
        errorMsg.innerText = `\u26A0 Error connecting to server... please try again later`;
        errorMsg.classList.remove("hidden");
        errorMsg.style.top = -errorMsg.offsetHeight;
    };
};

// function triggers when login-input is submitted
loginInput.onsubmit = (event) => {
    event.preventDefault();
    const body = {
        username: loginInput.uname.value,
        password: loginInput.psw.value
    };
    authenticateUser(body);
};

document.getElementById('switch-user-btn').onclick = toggleHide;
document.getElementById('demo-btn').onclick = () => authenticateUser({username: 'Demo'});