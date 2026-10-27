const db = require('../db');

// Get Mandi Prices with optional state/district/commodity filter
exports.getPrices = async (req, res) => {
  try {
    const { state, district, commodity } = req.query;
    let query = 'SELECT * FROM mandi_prices WHERE 1=1';
    const params = [];

    if (state) {
      params.push(`%${state}%`);
      query += ` AND state ILIKE $${params.length}`;
    }
    if (district) {
      params.push(`%${district}%`);
      query += ` AND district ILIKE $${params.length}`;
    }
    if (commodity) {
      params.push(`%${commodity}%`);
      query += ` AND commodity ILIKE $${params.length}`;
    }

    query += ' ORDER BY commodity ASC, recorded_at DESC';

    const result = await db.query(query, params);
    return res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('getPrices error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving mandi prices.' });
  }
};
