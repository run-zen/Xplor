/* eslint-disable */
import { displayMap } from './mapbox.js';
import { login, logout } from './login.js';
import { signup, resendEmail, confirmEmail } from './createAccount.js';
import { updateUser, updatePassword } from './updateSettings.js';
import { showAlert } from './alert.js';
// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('#login--form');
const signUpForm = document.querySelector('#signUp--form');
const resendForm = document.querySelector('#resendConfirmationEmail--form');
const logoutBtn = document.querySelector('.nav__el--logout');
const emailConfirmForm = document.querySelector('#confirmEmail--form');
const UpdateUserForm = document.getElementById('update-user--form');
const UpdatePasswordForm = document.getElementById('update-password--form');
const changeSettingsBtn = document.getElementById('change-settings--btn');
const changePasswordBtn = document.getElementById('change-password--btn');

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
    signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const signUpBtn = document.getElementById('form-signup--btn');
        signUpBtn.textContent = 'Creating User...';
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const res = await signup(name, email, password, confirmPassword, e);

        signUpBtn.textContent = 'Submit';
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
    emailConfirmForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const confirmBtn = document.getElementById('confirm-email--btn');
        confirmBtn.textContent = 'Confirming...';
        const token = document.getElementById('EmailConfirmtoken').dataset.token;

        const res = await confirmEmail(token);
        if (res === 'success') {
            confirmBtn.textContent = 'Email Confirmed';
            confirmBtn.type = 'button';
        } else {
            confirmBtn.textContent = 'Confirm Email';
        }
    });
}

if (UpdateUserForm) {
    UpdateUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('save-settings--btn');

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const photo = document.getElementById('photo');
        if (name.readOnly || email.readOnly || photo.disabled) {
            return showAlert('error', 'click edit first');
        }
        saveBtn.innerHTML = 'saving...';
        const form = new FormData();
        form.append('name', name.value);
        form.append('email', email.value);
        form.append('photo', photo.files[0]);

        const res = await updateUser(form);
        if (res.status === 'success') {
            name.readOnly = true;
            email.readOnly = true;
            photo.disabled = true;
            setTimeout(function () {
                document.getElementById('change-settings--btn').innerHTML = 'edit';
                location.reload();
            }, 2000);
        }
        setTimeout(() => (saveBtn.innerHTML = 'save settings'), 2000);
    });
}
if (UpdatePasswordForm) {
    UpdatePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('save-password--btn');

        const passwordCurrent = document.getElementById('password-current');
        const newPassword = document.getElementById('password');
        const newPasswordConfirm = document.getElementById('password-confirm');
        if (passwordCurrent.readOnly || newPassword.readOnly || newPasswordConfirm.readOnly) {
            return showAlert('error', 'click edit first');
        }
        saveBtn.innerHTML = 'saving...';
        const res = await updatePassword(
            passwordCurrent.value,
            newPassword.value,
            newPasswordConfirm.value,
            e
        );
        if (res === 'success') {
            passwordCurrent.readOnly = true;
            newPassword.readOnly = true;
            newPasswordConfirm.readOnly = true;
            document.getElementById('change-password--btn').innerHTML = 'edit';
        }
        saveBtn.innerHTML = 'save password';
    });
}

if (changeSettingsBtn) {
    changeSettingsBtn.addEventListener('click', () => {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const photo = document.getElementById('photo');
        name.readOnly = !name.readOnly;
        email.readOnly = !email.readOnly;
        photo.disabled = !photo.disabled;
        if (changeSettingsBtn.innerHTML === 'edit') {
            changeSettingsBtn.innerHTML = 'Cancel';
        } else {
            changeSettingsBtn.innerHTML = 'edit';
            name.value = name.dataset.name;
            email.value = email.dataset.email;
            photo.files = null;
        }
    });
}
if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
        const passwordCurrent = document.getElementById('password-current');
        const newPassword = document.getElementById('password');
        const newPasswordConfirm = document.getElementById('password-confirm');
        passwordCurrent.readOnly = !passwordCurrent.readOnly;
        newPassword.readOnly = !newPassword.readOnly;
        newPasswordConfirm.readOnly = !newPasswordConfirm.readOnly;

        if (changePasswordBtn.innerHTML === 'edit') changePasswordBtn.innerHTML = 'Cancel';
        else {
            changePasswordBtn.innerHTML = 'edit';
            passwordCurrent.value = '';
            newPassword.value = '';
            newPasswordConfirm.value = '';
        }
    });
}
