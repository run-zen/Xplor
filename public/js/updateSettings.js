import { showAlert } from './alert.js';
import axios from 'axios';

export const updateUser = async (data) => {
    try {
        const response = await axios({
            method: 'PATCH',
            url: 'http://localhost:8000/api/v1/users/updateme',
            data,
        });

        if (response.data.status === 'success') {
            showAlert('success', 'User Updated Successfully');
        }
        return response.data;
    } catch (error) {
        let message = error.response.data.message;
        showAlert('error', message);
        return 'error';
    }
};

export const updatePassword = async (
    password,
    newPassword,
    newPasswordConfirm,
    event
) => {
    try {
        if (newPassword !== newPasswordConfirm) {
            showAlert('error', 'new passwords do not match');
            return 'error';
        }
        const response = await axios({
            method: 'PATCH',
            url: 'http://localhost:8000/api/v1/users/updatepassword',
            data: {
                password,
                newPassword,
                newPasswordConfirm,
            },
        });

        if (response.data.status === 'success') {
            event.target.reset();
            showAlert('success', 'Password updated successfully');
        }
        return 'success';
    } catch (error) {
        let message = error.response.data.message;
        showAlert('error', message);
        return 'error';
    }
};
