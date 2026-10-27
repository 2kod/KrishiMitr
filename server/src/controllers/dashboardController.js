const db = require('../db');

exports.getDashboardSummary = async (req, res) => {
  try {
    const farmerId = req.farmer ? req.farmer.id : null;
    let farmer = null;

    if (farmerId) {
      const farmerRes = await db.query(
        'SELECT id, full_name, email, phone, state, district, pincode, farm_size, created_at FROM farmers WHERE id = $1',
        [farmerId]
      );
      if (farmerRes.rows.length > 0) farmer = farmerRes.rows[0];
    }

    const state = farmer ? farmer.state : 'Rajasthan';
    const district = farmer ? farmer.district : 'Jaipur';

    // 1. Fetch Crops for farmer's state or fallback to popular crops
    const cropsRes = await db.query(
      'SELECT id, name, type, state, description, ideal_temperature, rainfall_req FROM crops WHERE state ILIKE $1 ORDER BY id ASC LIMIT 6',
      [`%${state}%`]
    );
    let crops = cropsRes.rows;
    if (crops.length === 0) {
      const fallbackCrops = await db.query('SELECT id, name, type, state, description, ideal_temperature, rainfall_req FROM crops LIMIT 4');
      crops = fallbackCrops.rows;
    }

    // 2. Fetch Mandi Prices for district or state
    let mandiRes = await db.query(
      'SELECT id, commodity, state, district, market, modal_price, min_price, max_price, trend, recorded_at FROM mandi_prices WHERE district ILIKE $1 ORDER BY recorded_at DESC LIMIT 6',
      [`%${district}%`]
    );
    if (mandiRes.rows.length === 0) {
      mandiRes = await db.query(
        'SELECT id, commodity, state, district, market, modal_price, min_price, max_price, trend, recorded_at FROM mandi_prices WHERE state ILIKE $1 ORDER BY recorded_at DESC LIMIT 6',
        [`%${state}%`]
      );
    }
    if (mandiRes.rows.length === 0) {
      mandiRes = await db.query('SELECT id, commodity, state, district, market, modal_price, min_price, max_price, trend, recorded_at FROM mandi_prices LIMIT 6');
    }

    // 3. Fetch Recent Disease Scans if logged in
    let scans = [];
    if (farmerId) {
      const scansRes = await db.query(
        'SELECT id, image_name, disease_name, confidence, severity, cure, scanned_at FROM disease_scans WHERE farmer_id = $1 ORDER BY scanned_at DESC LIMIT 5',
        [farmerId]
      );
      scans = scansRes.rows;
    }

    return res.json({
      success: true,
      farmer,
      state,
      district,
      crops,
      mandiPrices: mandiRes.rows,
      recentScans: scans
    });
  } catch (err) {
    console.error('getDashboardSummary error:', err);
    return res.status(500).json({ success: false, message: 'Server error loading dashboard.' });
  }
};
