import { prisma } from '../../../lib/prisma';
import { sendEmail } from '../../../utils/sendEmail';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { email, verificationCode, newPassword, action } = req.body;

  try {
    if (action === 'send-code') {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ error: 'User not found' });

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 minutes

      await prisma.verification.upsert({
        where: { email },
        update: { code, expiresAt },
        create: { email, code, expiresAt }
      });

      const emailSent = await sendEmail(email, 'Reset Password Code', `<p>Your verification code is: <strong>${code}</strong></p>`);
      if (!emailSent) return res.status(500).json({ error: 'Failed to send verification email. Try again.' });

      return res.status(200).json({ message: 'Verification code sent. Check your email.' });
    }

    if (action === 'verify-code') {
      const storedCode = await prisma.verification.findUnique({ where: { email } });

      if (!storedCode || storedCode.code !== verificationCode || new Date() > storedCode.expiresAt) {
        return res.status(400).json({ error: 'Invalid or expired verification code' });
      }

      return res.status(200).json({ message: 'Verification successful. You can now reset your password.' });
    }

    if (action === 'reset-password') {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ error: 'User not found' });

      const storedCode = await prisma.verification.findUnique({ where: { email } });
      if (!storedCode) return res.status(400).json({ error: 'Verification required' });

      await prisma.user.update({
        where: { email },
        data: { password: newPassword }
      });

      await prisma.verification.delete({ where: { email } });

      return res.status(200).json({ message: 'Password reset successful. You can now log in.' });
    }

    return res.status(400).json({ error: 'Invalid request' });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
}
