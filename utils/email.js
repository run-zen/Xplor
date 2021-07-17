import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
    // 1) Create tranporter
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    // 2) Define email options
    const mailOptions = {
        from: "Ranjan Baruah <ranjan@email.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    // 3) Actually send the email
    await transport.sendMail(mailOptions);
};
