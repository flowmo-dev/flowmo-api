import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userRepository = getRepository(User);

    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = userRepository.create({ username, password: hashedPassword });
    await userRepository.save(newUser);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error registering user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Error logging in' });
  }
});

router.post('/logout', (_req, res) => {
  // Client-side logout (clear token)
  return res.json({ message: 'Logged out successfully' });
});

router.get('/user', authMiddleware, async (req, res) => {
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: (req as any).user.id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching user information' });
  }
});

export const authRouter = router;