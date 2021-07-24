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
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:8000/api/v1/users/logout',
        });
        if (res.data.status === 'success') {
            showAlert('success', 'successfully logged out');
            window.setTimeout(afterLogout, 2000);
        }
    } catch (error) {
        showAlert('error', 'Error logging out! try again.');
    }
};

const afterLogout = () => {
    location.reload(true);
    location.assign('/');
};