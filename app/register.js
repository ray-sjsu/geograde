import { pool } from '../../lib/db'; 
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const [result] = await pool.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      return res.status(201).json({ message: 'User registered successfully :3' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Registration failed' });
    }
  }
}