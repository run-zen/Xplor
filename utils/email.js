import nodemailer from 'nodemailer';
import pug from 'pug';
import path from 'path';
import { convert } from 'html-to-text';

export class Email {
    constructor(user, url) {
        this.user = user;
        this.to = user.email;
        this.firstname = user.name.split(' ')[0];
        this.url = url;
        this.from = `Xplor <${process.env.ADMIN_EMAIL}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendinBlue',
                auth: {
                    user: process.env.SIB_EMAIL,
                    pass: process.env.SIB_PASSWORD,
                },
            });
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    // send template in email
    async send(template, subject) {
        // render HTML based on a pug template
        const html = pug.renderFile(`${path.resolve('views')}/emails/${template}.pug`, {
            firstName: this.firstname,
            url: this.url,
            subject,
            user: this.user,
        });

        // Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html),
        };

        // 3) create transport and send Email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to Xplor!');
    }

    async resetPassword() {
        await this.send('passwordReset', 'Password Reset for xplor.io');
    }
}

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
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
    await transporter.sendMail(mailOptions);
};

// 1) Create tranporter for SIB
// const transporter = nodemailer.createTransport({
//     service: 'SendinBlue',
//     auth: {
//         user: process.env.SIB_EMAIL,
//         pass: process.env.SIB_PASSWORD,
//     },
// });
