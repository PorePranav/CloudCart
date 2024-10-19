import nodemailer from 'nodemailer';

import { MailOptions } from '../types';

export const sendEmail = async (options: MailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_APP_EMAILID,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'CloudCart <hello@cloudcart.com>',
    to: options.to,
    subject: options.subject,
    html: options.emailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};
