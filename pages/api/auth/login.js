// API for Log in
import { prisma } from '../../../lib/prisma';
import { generateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    // Include userId in response
    res.status(200).json({ 
      message: 'Login successful!', 
      token, 
      role: user.role,
      userId: user.id // Return userId
    });
  } else {
    res.status(405).end();
  }
}
