/* eslint-disable */
import { displayMap } from './mapbox.js';
import { login, logout } from './login.js';
import { signup, resendEmail, confirmEmail } from './createAccount.js';
// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('#login--form');
const signUpForm = document.querySelector('#signUp--form');
const resendForm = document.querySelector('#resendConfirmationEmail--form');
const logoutBtn = document.querySelector('.nav__el--logout');
const emailConfirmForm = document.querySelector('#confirmEmail--form');
// Delegation
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

// Event Listeners

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password, e);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

if (signUpForm) {
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword =
            document.getElementById('confirmPassword').value;
        signup(name, email, password, confirmPassword, e);
    });
}

if (resendForm) {
    resendForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        resendEmail(email, e);
    });
}

if (emailConfirmForm) {
    emailConfirmForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const token =
            document.getElementById('EmailConfirmtoken').dataset.token;
        console.log(token);
        confirmEmail(token);
    });
}
