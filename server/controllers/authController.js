import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'syvora_beauty_jwt_secret_key_2026_super_secure';

export function register(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    // Check existing email
    const existingStmt = db.prepare('SELECT id FROM users WHERE email = ?');
    const existing = existingStmt.get(email.toLowerCase().trim());

    if (existing) {
      return res.status(400).json({ success: false, message: 'Email address is already registered.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const insertStmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, phone, role, addresses)
      VALUES (?, ?, ?, ?, 'customer', '[]')
    `);

    const info = insertStmt.run(name, email.toLowerCase().trim(), passwordHash, phone || '');
    const userId = info.lastInsertRowid;

    const token = jwt.sign(
      { id: userId, email: email.toLowerCase().trim(), name, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        name,
        email: email.toLowerCase().trim(),
        phone: phone || '',
        role: 'customer',
        addresses: []
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

export function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const input = email.trim();
    const stmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(name) = ? OR email = ?');
    const user = stmt.get(input.toLowerCase(), input.toLowerCase(), input);

    // Also support username 'Fahim' or 'admin' for admin login
    let targetUser = user;
    if (!targetUser && (input.toLowerCase() === 'admin' || input.toLowerCase() === 'fahim')) {
      const adminStmt = db.prepare("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
      targetUser = adminStmt.get();
    }

    if (!targetUser) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = bcrypt.compareSync(password, targetUser.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: targetUser.id, email: targetUser.email, name: targetUser.name, role: targetUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    let parsedAddresses = [];
    try {
      parsedAddresses = JSON.parse(targetUser.addresses || '[]');
    } catch (e) {
      parsedAddresses = [];
    }

    res.json({
      success: true,
      token,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
        role: targetUser.role,
        addresses: parsedAddresses
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

export function getProfile(req, res) {
  try {
    const stmt = db.prepare('SELECT id, name, email, phone, role, addresses, created_at FROM users WHERE id = ?');
    const user = stmt.get(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let parsedAddresses = [];
    try {
      parsedAddresses = JSON.parse(user.addresses || '[]');
    } catch (e) {
      parsedAddresses = [];
    }

    res.json({
      success: true,
      user: {
        ...user,
        addresses: parsedAddresses
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

export function updateProfile(req, res) {
  try {
    const { name, phone, addresses } = req.body;
    const userId = req.user.id;

    const stmt = db.prepare(`
      UPDATE users
      SET name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          addresses = COALESCE(?, addresses)
      WHERE id = ?
    `);

    stmt.run(name, phone, addresses ? JSON.stringify(addresses) : null, userId);

    const updatedUserStmt = db.prepare('SELECT id, name, email, phone, role, addresses FROM users WHERE id = ?');
    const updatedUser = updatedUserStmt.get(userId);

    let parsedAddresses = [];
    try {
      parsedAddresses = JSON.parse(updatedUser.addresses || '[]');
    } catch (e) {}

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        ...updatedUser,
        addresses: parsedAddresses
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
}

export function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current and new password are required.' });
    }

    const stmt = db.prepare('SELECT password_hash FROM users WHERE id = ?');
    const user = stmt.get(userId);

    if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);

    const updateStmt = db.prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    updateStmt.run(newHash, userId);

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
}
