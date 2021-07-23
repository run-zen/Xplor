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
        showAlert('error', error.response.data.message);
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
            window.setTimeout(location.reload(true), 2000);
        }
    } catch (error) {
        showAlert('error', 'Error logging out! try again.');
    }
};
