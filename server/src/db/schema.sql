-- KrishiMitra PostgreSQL Schema

-- 1. Farmers / Users Table
CREATE TABLE IF NOT EXISTS farmers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(25),
    password_hash VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Rajasthan',
    district VARCHAR(100) NOT NULL DEFAULT 'Jaipur',
    pincode VARCHAR(10),
    farm_size NUMERIC(6, 2) DEFAULT 2.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crops Advisory Database
CREATE TABLE IF NOT EXISTS crops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Kharif, Rabi, Zaid
    state VARCHAR(100) NOT NULL,
    description TEXT,
    ideal_temperature VARCHAR(50),
    rainfall_req VARCHAR(50)
);

-- 3. Live Mandi Market Prices
CREATE TABLE IF NOT EXISTS mandi_prices (
    id SERIAL PRIMARY KEY,
    commodity VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    market VARCHAR(100),
    modal_price NUMERIC(10, 2) NOT NULL,
    min_price NUMERIC(10, 2),
    max_price NUMERIC(10, 2),
    trend VARCHAR(10) DEFAULT 'up', -- 'up' or 'down'
    recorded_at DATE DEFAULT CURRENT_DATE
);

-- 4. Leaf Disease Scans Log
CREATE TABLE IF NOT EXISTS disease_scans (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id) ON DELETE CASCADE,
    image_name TEXT,
    disease_name VARCHAR(150) NOT NULL,
    confidence NUMERIC(5, 3) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    cure TEXT NOT NULL,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Fertilizer Store Products
CREATE TABLE IF NOT EXISTS fertilizer_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Organic, Chemical, Micronutrient
    price NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(50) DEFAULT '50 kg bag',
    description TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE
);

-- 6. Fertilizer Orders / Inquiries
CREATE TABLE IF NOT EXISTS fertilizer_orders (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id) ON DELETE SET NULL,
    farmer_name VARCHAR(150) NOT NULL,
    farmer_phone VARCHAR(25) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    quantity INTEGER DEFAULT 1,
    total_price NUMERIC(10, 2) NOT NULL,
    district VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- SEED DATA (Only inserted if tables are empty)
-- ==========================================================

-- Seed Crops
INSERT INTO crops (name, type, state, description, ideal_temperature, rainfall_req)
SELECT * FROM (VALUES
    ('Wheat (Kalyan Sona)', 'Rabi', 'Rajasthan', 'High yield winter grain, suited for irrigated loamy soils.', '15°C - 25°C', '40 - 75 cm'),
    ('Bajra (Pearl Millet)', 'Kharif', 'Rajasthan', 'Drought-resistant staple cereal ideal for arid sandy soil.', '25°C - 35°C', '30 - 50 cm'),
    ('Mustard (Pusa Bold)', 'Rabi', 'Rajasthan', 'Major commercial oilseed crop with high oil content.', '15°C - 25°C', '25 - 40 cm'),
    ('Maize (Ganga 11)', 'Kharif', 'Bihar', 'Heavy nutrient feeder with robust cob formation.', '21°C - 27°C', '50 - 100 cm'),
    ('Paddy / Rice (Katarni)', 'Kharif', 'Bihar', 'Fragrant indigenous rice variety with premium market price.', '22°C - 32°C', '100 - 150 cm'),
    ('Wheat (HD 2967)', 'Rabi', 'Punjab', 'High yield, rust-resistant dwarf wheat.', '15°C - 22°C', '50 - 80 cm'),
    ('Cotton (Bt Cotton)', 'Kharif', 'Punjab', 'Major cash crop suited for black and deep alluvial soil.', '21°C - 30°C', '50 - 100 cm'),
    ('Soybean (JS 335)', 'Kharif', 'Maharashtra', 'Protein-rich legume crop improving nitrogen fixation.', '20°C - 30°C', '60 - 90 cm'),
    ('Sugarcane (Co 86032)', 'Annual', 'Maharashtra', 'Cash crop requiring reliable irrigation.', '20°C - 35°C', '150 - 250 cm')
) AS v(name, type, state, description, ideal_temperature, rainfall_req)
WHERE NOT EXISTS (SELECT 1 FROM crops LIMIT 1);

-- Seed Mandi Prices
INSERT INTO mandi_prices (commodity, state, district, market, modal_price, min_price, max_price, trend)
SELECT * FROM (VALUES
    ('Wheat', 'Rajasthan', 'Jaipur', 'Chomu Mandi', 2250.00, 2180.00, 2320.00, 'up'),
    ('Mustard', 'Rajasthan', 'Jaipur', 'Jaipur Grain Mandi', 5450.00, 5300.00, 5600.00, 'up'),
    ('Bajra', 'Rajasthan', 'Jaipur', 'Bassi Mandi', 2150.00, 2050.00, 2220.00, 'down'),
    ('Gram (Chana)', 'Rajasthan', 'Jaipur', 'Jaipur Central', 5800.00, 5650.00, 5950.00, 'up'),
    ('Maize', 'Bihar', 'Patna', 'Bakhtiyarpur Mandi', 2080.00, 1980.00, 2150.00, 'up'),
    ('Paddy (Dhan)', 'Bihar', 'Patna', 'Fatuha Mandi', 2183.00, 2100.00, 2250.00, 'up'),
    ('Wheat', 'Punjab', 'Ludhiana', 'Khanna Mandi', 2275.00, 2220.00, 2340.00, 'up'),
    ('Cotton', 'Punjab', 'Bhatinda', 'Bathinda APMC', 6950.00, 6700.00, 7150.00, 'down'),
    ('Soybean', 'Maharashtra', 'Pune', 'Pune APMC', 4650.00, 4450.00, 4800.00, 'up'),
    ('Onion', 'Maharashtra', 'Nashik', 'Lasalgaon Mandi', 1850.00, 1600.00, 2100.00, 'up')
) AS v(commodity, state, district, market, modal_price, min_price, max_price, trend)
WHERE NOT EXISTS (SELECT 1 FROM mandi_prices LIMIT 1);

-- Seed Fertilizer Products
INSERT INTO fertilizer_products (name, category, price, unit, description, image_url)
SELECT * FROM (VALUES
    ('IFFCO Urea (Neem Coated)', 'Chemical', 266.50, '45 kg bag', '46% Nitrogen content, slow release neem oil coating prevents leaching.', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=400&q=80'),
    ('IFFCO DAP (Di-Ammonium Phosphate)', 'Chemical', 1350.00, '50 kg bag', '18% Nitrogen and 46% Phosphorus (P2O5) for root development.', 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=400&q=80'),
    ('Muriate of Potash (MOP)', 'Chemical', 1650.00, '50 kg bag', '60% K2O Potassium for disease resistance, grain weight, and drought endurance.', 'https://images.unsplash.com/photo-1592417817098-8f3d69102353?auto=format&fit=crop&w=400&q=80'),
    ('Pure Organic Vermicompost', 'Organic', 450.00, '50 kg bag', 'Enriched worm castings with micronutrients and beneficial soil microbes.', 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80'),
    ('Neem Cake Organic Fertilizer', 'Organic', 650.00, '40 kg bag', 'Dual action bio-fertilizer and natural nematode repellent.', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80'),
    ('Zinc Sulphate (21% Zn)', 'Micronutrient', 380.00, '10 kg bag', 'Prevents Khaira disease in paddy and chlorosis in wheat/maize.', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80')
) AS v(name, category, price, unit, description, image_url)
WHERE NOT EXISTS (SELECT 1 FROM fertilizer_products LIMIT 1);
