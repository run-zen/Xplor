import axios from 'axios';
import { showAlert } from './alert.js';

export const login = async (email, password, event) => {
    try {
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:8000/api/v1/users/login',
            data: {
                email,
                password,
            },
        });
        event.target.reset();
        if (response.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            window.setTimeout(location.assign('/'), 1500);
        }
    } catch (error) {
        let message = error.response.data.message;
        if (message.startsWith('Email not confirmed')) {
            message =
                "Email Not confirm.Click <a href='/resendEmailConfirmationToken' class='resend--link'>here</a> to resend confirmation email";
        }
        showAlert('error', message, 1);
    }
    return;
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:8000/api/v1/users/logout',
        });
        if (res.data.status === 'success') {
            showAlert('success', 'successfully logged out');
            window.setTimeout(afterLogout, 1500);
        }
    } catch (error) {
        showAlert('error', 'Error logging out! try again.');
    }
};

const afterLogout = () => {
    location.reload(true);
    location.assign('/');
};

export const forgotPassword = async (email, event) => {
    try {
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:8000/api/v1/users/forgotpassword',
            data: {
                email,
            },
        });
        event.target.reset();
        if (response.data.status === 'success') {
            showAlert('success', response.data.message, 1);
        }
    } catch (error) {
        let message = error.response.data.message;
        showAlert('error', message, 1);
    }
    return;
};
export const resetPassword = async (password, passwordConfirm, token, event) => {
    if (password !== passwordConfirm) {
        return showAlert('error', `Passwords doesn't match`, 1800);
    }
    try {
        const response = await axios({
            method: 'PATCH',
            url: `http://localhost:8000/api/v1/users/resetpassword/${token}`,
            data: {
                password,
                passwordConfirm,
            },
        });
        event.target.reset();
        if (response.data.status === 'success') {
            showAlert('success', 'Password Changed Successfully', 1);
        }
    } catch (error) {
        let message = error.response.data.message;
        showAlert('error', message, 1);
    }
    return;
};
