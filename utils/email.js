import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    // 1) Create tranporter
    const transport = nodemailer.createTransport({
        service: 'SendinBlue',
        auth: {
            user: process.env.SIB_EMAIL,
            pass: process.env.SIB_PASSWORD,
        },
    });
    // 2) Define email options
    const mailOptions = {
        from: 'Xplor <admin@xplor.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    // 3) Actually send the email
    await transport.sendMail(mailOptions);
};
