const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'glowpos_db',
  user: 'mannn',
  password: 'mannn'
});

const products = [
  // Coffee
  { name: 'Espresso', category: 'coffee', price: '25000', description: 'Single shot of rich espresso', stock: 50 },
  { name: 'Cappuccino', category: 'coffee', price: '35000', description: 'Espresso with steamed milk foam', stock: 50 },
  { name: 'Latte', category: 'coffee', price: '38000', description: 'Smooth espresso with steamed milk', stock: 50 },
  { name: 'Americano', category: 'coffee', price: '28000', description: 'Espresso diluted with hot water', stock: 50 },
  { name: 'Mocha', category: 'coffee', price: '42000', description: 'Espresso with chocolate and milk', stock: 50 },
  { name: 'Cold Brew', category: 'coffee', price: '32000', description: 'Slow-steeped cold coffee', stock: 50 },
  // Tea & Non-Coffee
  { name: 'Green Tea', category: 'tea', price: '22000', description: 'Hot Japanese green tea', stock: 50 },
  { name: 'Chamomile Tea', category: 'tea', price: '25000', description: 'Calming herbal tea', stock: 50 },
  { name: 'Fresh Orange Juice', category: 'tea', price: '30000', description: 'Freshly squeezed orange', stock: 50 },
  { name: 'Mango Smoothie', category: 'tea', price: '35000', description: 'Creamy mango blended drink', stock: 50 },
  // Main Course
  { name: 'Nasi Goreng Spesial', category: 'food', price: '45000', description: 'Special fried rice with egg', stock: 30 },
  { name: 'Mie Goreng Seafood', category: 'food', price: '52000', description: 'Fried noodles with seafood', stock: 30 },
  { name: 'Ayam Bakar', category: 'food', price: '55000', description: 'Grilled chicken with sambal', stock: 30 },
  { name: 'Steak Daging', category: 'food', price: '85000', description: 'Beef steak with mashed potato', stock: 20 },
  { name: 'Pasta Carbonara', category: 'food', price: '60000', description: 'Creamy bacon pasta', stock: 25 },
  { name: 'Fish & Chips', category: 'food', price: '50000', description: 'Crispy fish with fries', stock: 25 },
  // Snacks
  { name: 'French Fries', category: 'snacks', price: '25000', description: 'Crispy golden fries', stock: 50 },
  { name: 'Chicken Wings', category: 'snacks', price: '35000', description: 'BBQ glazed wings', stock: 40 },
  { name: 'Roti Bakar', category: 'snacks', price: '22000', description: 'Toasted bread with chocolate', stock: 50 },
  { name: 'Nachos', category: 'snacks', price: '30000', description: 'Tortilla chips with salsa', stock: 40 },
];

const tables = [
  { table_number: 'T-01', status: 'occupied' },
  { table_number: 'T-02', status: 'available' },
  { table_number: 'T-03', status: 'available' },
  { table_number: 'T-04', status: 'occupied' },
  { table_number: 'T-05', status: 'available' },
  { table_number: 'T-06', status: 'available' },
  { table_number: 'T-07', status: 'available' },
  { table_number: 'T-08', status: 'occupied' },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM transactions');
    await client.query('DELETE FROM tables');
    await client.query('DELETE FROM products');
    console.log('Cleared existing data');

    // Insert products
    const productIds = [];
    for (const p of products) {
      const res = await client.query(
        'INSERT INTO products (name, category, price, description, stock, updated_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, name',
        [p.name, p.category, p.price, p.description, p.stock]
      );
      productIds.push(res.rows[0]);
      console.log(`  Product: ${res.rows[0].name}`);
    }

    // Insert tables
    const tableIds = [];
    for (const t of tables) {
      const res = await client.query(
        'INSERT INTO tables (table_number, status) VALUES ($1, $2) RETURNING id, table_number',
        [t.table_number, t.status]
      );
      tableIds.push(res.rows[0]);
      console.log(`  Table: ${res.rows[0].table_number}`);
    }

    // Get admin employee
    const adminRes = await client.query('SELECT id FROM employees WHERE username = $1', ['admin']);
    const adminId = adminRes.rows[0].id;

    const now = new Date();

    // Create transactions
    const txData = [
      // Table transactions (linked to T-01 and admin)
      {
        table_id: 'T-01',
        employee_id: adminId,
        status: 'completed',
        payment_method: 'qris',
        total_amount: '108000',
        items: JSON.stringify([
          { id: productIds[1].id, name: 'Cappuccino', price: 35000, quantity: 2 },
          { id: productIds[10].id, name: 'Nasi Goreng Spesial', price: 45000, quantity: 1 }
        ]),
        created_at: new Date(now.getTime() - 2 * 3600000)
      },
      // Table T-04 (linked to admin)
      {
        table_id: 'T-04',
        employee_id: adminId,
        status: 'completed',
        payment_method: 'cash',
        total_amount: '170000',
        items: JSON.stringify([
          { id: productIds[13].id, name: 'Steak Daging', price: 85000, quantity: 2 }
        ]),
        created_at: new Date(now.getTime() - 5 * 3600000)
      },
      // Table T-08 pending (linked to admin)
      {
        table_id: 'T-08',
        employee_id: adminId,
        status: 'pending',
        payment_method: 'cash',
        total_amount: '112000',
        items: JSON.stringify([
          { id: productIds[4].id, name: 'Mocha', price: 42000, quantity: 1 },
          { id: productIds[17].id, name: 'Chicken Wings', price: 35000, quantity: 1 },
          { id: productIds[9].id, name: 'Mango Smoothie', price: 35000, quantity: 1 }
        ]),
        created_at: new Date(now.getTime() - 1 * 3600000)
      },
      // Walk-in (no table, linked to admin)
      {
        table_id: null,
        employee_id: adminId,
        status: 'completed',
        payment_method: 'qris',
        total_amount: '63000',
        items: JSON.stringify([
          { id: productIds[0].id, name: 'Espresso', price: 25000, quantity: 1 },
          { id: productIds[19].id, name: 'Nachos', price: 30000, quantity: 1 }
        ]),
        created_at: new Date(now.getTime() - 8 * 3600000)
      },
      // Walk-in (no table, linked to admin)
      {
        table_id: null,
        employee_id: adminId,
        status: 'completed',
        payment_method: 'cash',
        total_amount: '77000',
        items: JSON.stringify([
          { id: productIds[5].id, name: 'Cold Brew', price: 32000, quantity: 1 },
          { id: productIds[18].id, name: 'Roti Bakar', price: 22000, quantity: 1 },
          { id: productIds[16].id, name: 'French Fries', price: 25000, quantity: 1 }
        ]),
        created_at: new Date(now.getTime() - 12 * 3600000)
      },
      // Table T-01 completed
      {
        table_id: 'T-01',
        employee_id: adminId,
        status: 'completed',
        payment_method: 'qris',
        total_amount: '82000',
        items: JSON.stringify([
          { id: productIds[2].id, name: 'Latte', price: 38000, quantity: 1 },
          { id: productIds[12].id, name: 'Ayam Bakar', price: 55000, quantity: 1 }
        ]),
        created_at: new Date(now.getTime() - 24 * 3600000)
      },
    ];

    for (const t of txData) {
      const res = await client.query(
        `INSERT INTO transactions (table_id, employee_id, status, payment_method, total_amount, items, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [t.table_id, t.employee_id, t.status, t.payment_method, t.total_amount, t.items, t.created_at]
      );
      console.log(`  TX #${res.rows[0].id}: Rp ${t.total_amount} | ${t.table_id || 'Walk-in'} | ${t.status}`);
    }

    await client.query('COMMIT');
    console.log('\nSeeding complete!');
    console.log(`  Products: ${products.length}`);
    console.log(`  Tables: ${tables.length}`);
    console.log(`  Transactions: ${txData.length}`);
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
    pool.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
