const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

// Register Farmer
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, state, district, pincode, farmSize } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
    }

    // Check if email already exists
    const existing = await db.query('SELECT id FROM farmers WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please log in.' });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert into PostgreSQL
    const result = await db.query(
      `INSERT INTO farmers (full_name, email, phone, password_hash, state, district, pincode, farm_size)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, full_name, email, phone, state, district, pincode, farm_size, created_at`,
      [
        fullName.trim(),
        email.toLowerCase().trim(),
        phone || '',
        passwordHash,
        state || 'Rajasthan',
        district || 'Jaipur',
        pincode || '',
        parseFloat(farmSize) || 2.0
      ]
    );

    const farmer = result.rows[0];

    // Sign JWT
    const token = jwt.sign(
      {
        id: farmer.id,
        email: farmer.email,
        fullName: farmer.full_name,
        state: farmer.state,
        district: farmer.district
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      farmer
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration. Please try again.' });
  }
};

// Login Farmer
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const result = await db.query('SELECT * FROM farmers WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid credentials. No account found with this email.' });
    }

    const farmer = result.rows[0];

    // Compare bcrypt password
    const isMatch = await bcrypt.compare(password, farmer.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    // Sign JWT
    const token = jwt.sign(
      {
        id: farmer.id,
        email: farmer.email,
        fullName: farmer.full_name,
        state: farmer.state,
        district: farmer.district
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    delete farmer.password_hash;

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      farmer
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// Get Current Logged-in Farmer Profile
exports.getMe = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, full_name, email, phone, state, district, pincode, farm_size, created_at FROM farmers WHERE id = $1',
      [req.farmer.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Farmer not found.' });
    }

    return res.json({ success: true, farmer: result.rows[0] });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, state, district, pincode, farmSize } = req.body;
    const result = await db.query(
      `UPDATE farmers
       SET full_name = COALESCE($1, full_name),
           phone = COALESCE($2, phone),
           state = COALESCE($3, state),
           district = COALESCE($4, district),
           pincode = COALESCE($5, pincode),
           farm_size = COALESCE($6, farm_size)
       WHERE id = $7
       RETURNING id, full_name, email, phone, state, district, pincode, farm_size, created_at`,
      [fullName, phone, state, district, pincode, farmSize ? parseFloat(farmSize) : undefined, req.farmer.id]
    );

    return res.json({ success: true, message: 'Profile updated successfully!', farmer: result.rows[0] });
  } catch (err) {
    console.error('updateProfile error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};
