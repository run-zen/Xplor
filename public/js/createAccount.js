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
                'Account Created successfully\nNow login with account'
            );
            window.setTimeout(location.assign('/login'), 6000);
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
