import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: 'Test Email',
      text: 'If you see this, email works!'
    });
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Test email error:', err);
  }
}
test();
