import { showAlert } from './alert.js';

export const signup = async (name, email, password, confirmPassword, event) => {
    if (password !== confirmPassword) {
        return showAlert('error', 'Passwords do not match');
    }
    try {
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:8000/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm: confirmPassword,
            },
        });
        event.target.reset();
        if (response.data.status === 'success') {
            showAlert(
                'success',
                `Success!! An Email will be send to you in a few minutes to confirm your account.Click <a href='/resendEmailConfirmationToken' class='verified--link'>here</a> to resend`,
                1
            );
        }
    } catch (error) {
        let message = error.response.data.message;
        console.log(message);
        if (message.startsWith('E11000')) {
            message = 'User already exists.\nPlease log in instead';
        }

        showAlert('error', message);
    }
};

export const resendEmail = async (email, event) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:8000/api/v1/users/resendemailconfirmationToken',
            data: {
                email,
            },
        });

        if (res.data.status === 'success') {
            showAlert(
                'success',
                `Email will be sent in a few minutes.\nIf you don't receive any email, please try again.`,
                1
            );
        } else if (res.data.status === 'verified') {
            showAlert(
                'success',
                `Email already Confirmed!.Click <a href='/login' class='verified--link'>here</a> to log in`,
                1
            );
        }
    } catch (error) {
        let message = error.response.data.message;
        showAlert('error', message, 1);
    }
};

export const confirmEmail = async (token) => {
    try {
        const URL = `http://localhost:8000/api/v1/users/confirmemail/${token}`;
        const res = await axios({
            method: 'PATCH',
            url: URL,
        });

        if (res.data.status === 'success') {
            showAlert(
                'success',
                `Email Confirmed!.Click <a href='/login' class=''resend--link>here</a> to log in`,
                1
            );
        }
    } catch (error) {
        let message = error.res.data.message;
        showAlert('error', message);
    }
};
