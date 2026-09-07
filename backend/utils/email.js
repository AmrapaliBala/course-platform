import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Your Course Platform Login OTP",

    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Login to Course Platform</h2>

        <p>Your one-time password is:</p>

        <h1>${otp}</h1>

        <p>This OTP expires in 10 minutes.</p>

        <p>If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  });
};