const db = require('../db');

exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM fertilizer_products WHERE is_available = TRUE';
    const params = [];

    if (category) {
      params.push(`%${category}%`);
      query += ` AND category ILIKE $${params.length}`;
    }

    query += ' ORDER BY id ASC';
    const result = await db.query(query, params);
    return res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('getProducts error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving products.' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { productName, quantity, totalPrice, district, farmerName, farmerPhone } = req.body;
    const farmerId = req.farmer ? req.farmer.id : null;

    if (!productName || !totalPrice || !district) {
      return res.status(400).json({ success: false, message: 'Product name, total price, and district are required.' });
    }

    const name = farmerName || (req.farmer ? req.farmer.fullName : 'Guest Farmer');
    const phone = farmerPhone || (req.farmer ? req.farmer.phone : '');

    const result = await db.query(
      `INSERT INTO fertilizer_orders (farmer_id, farmer_name, farmer_phone, product_name, quantity, total_price, district, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Confirmed')
       RETURNING id, product_name, quantity, total_price, district, status, created_at`,
      [farmerId, name, phone, productName, quantity || 1, totalPrice, district]
    );

    return res.status(201).json({
      success: true,
      message: 'Fertilizer order placed successfully! Local agro-dealer will contact you.',
      order: result.rows[0]
    });
  } catch (err) {
    console.error('createOrder error:', err);
    return res.status(500).json({ success: false, message: 'Server error creating order.' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const farmerId = req.farmer.id;
    const result = await db.query(
      'SELECT id, product_name, quantity, total_price, district, status, created_at FROM fertilizer_orders WHERE farmer_id = $1 ORDER BY created_at DESC',
      [farmerId]
    );
    return res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('getMyOrders error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving orders.' });
  }
};
