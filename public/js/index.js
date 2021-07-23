/* eslint-disable */
import { displayMap } from './mapbox.js';
import { login, logout } from './login.js';
import { signup } from './createAccount.js';
// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('#login--form');
const signUpForm = document.querySelector('#signUp--form');
const logoutBtn = document.querySelector('.nav__el--logout');
// Delegation
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

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
