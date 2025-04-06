import nodemailer from 'nodemailer';

export async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Use environment variable
      pass: process.env.EMAIL_PASS   // Use App Password
    }
  });

  try {
    await transporter.sendMail({
      from: `Teacher’s Assistant <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Email Sending Error:", error);
    return false;
  }
}
