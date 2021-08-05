export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, message, time) => {
    hideAlert();

    const markup = `<div class='alert alert--${type}'>${message}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterend', markup);
    if (!time) {
        window.setTimeout(hideAlert, 5000);
    } else if (time === 1) {
        window.setTimeout(hideAlert, 10000);
    } else {
        window.setTimeout(hideAlert, time);
    }
};
