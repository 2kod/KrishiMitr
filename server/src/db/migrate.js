const fs = require('fs');
const path = require('path');
const { pool } = require('./index');

async function runMigration() {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    console.log('🔄 Applying PostgreSQL schema and seeds for KrishiMitra...');
    await pool.query(schemaSql);
    console.log('✅ PostgreSQL Database initialized and seeded successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    throw err;
  }
}

if (require.main === module) {
  runMigration().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = runMigration;
