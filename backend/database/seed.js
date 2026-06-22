const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { pool } = require('./db');

const CATEGORIES = [
  { name: 'Áo Đồng Phục', image: '/images/category-dong-phuc.jpg' },
  { name: 'Áo Sơ Mi', image: '/images/category-so-mi.jpg' },
  { name: 'Quần Đồng Phục', image: '/images/category-quan.jpg' },
  { name: 'Áo Khoác', image: '/images/category-ao-khoac.jpg' },
  { name: 'Veston / Blazer', image: '/images/category-veston.jpg' },
  { name: 'Đồ Bảo Hộ Lao Động', image: '/images/category-bao-ho.jpg' },
  { name: 'Phụ Kiện May Mặc', image: '/images/category-phu-kien.jpg' },
];

const PRODUCTS = [
  { name: 'Áo Thun Đồng Phục', description: 'Áo thun đồng phục chất lượng cao, phù hợp cho công ty, sự kiện. Chất liệu cotton 100% thoáng mát.', price: 85000, category: 'Áo Đồng Phục', stock: 500, sku: 'DP-AT-001' },
  { name: 'Áo Polo Đồng Phục', description: 'Áo polo đồng phục cao cấp, cổ bẻ lịch sự. Phù hợp cho nhân viên văn phòng.', price: 120000, category: 'Áo Đồng Phục', stock: 300, sku: 'DP-PL-001' },
  { name: 'Áo Sơ Mi Trắng', description: 'Áo sơ mi trắng tay dài, chất liệu cotton poly. Phù hợp cho học sinh, nhân viên.', price: 150000, sale_price: 130000, category: 'Áo Sơ Mi', stock: 400, sku: 'SM-TR-001' },
  { name: 'Áo Sơ Mi Sọc', description: 'Áo sơ mi sọc tay dài, form regular. Chất vải cao cấp không nhăn.', price: 180000, category: 'Áo Sơ Mi', stock: 200, sku: 'SM-SOC-001' },
  { name: 'Quần Tây Đồng Phục', description: 'Quần tây nam đồng phục, ống suông, form chuẩn. Chất liệu poly visco cao cấp.', price: 180000, category: 'Quần Đồng Phục', stock: 350, sku: 'QT-001' },
  { name: 'Quần Jean Đồng Phục', description: 'Quần jean đồng phục chất lượng cao, bền đẹp. Phù hợp cho môi trường năng động.', price: 200000, category: 'Quần Đồng Phục', stock: 250, sku: 'QJ-001' },
  { name: 'Áo Khoác Gió Đồng Phục', description: 'Áo khoác gió 2 lớp, chống nước nhẹ. In logo theo yêu cầu.', price: 250000, category: 'Áo Khoác', stock: 150, sku: 'AK-GIO-001' },
  { name: 'Áo Khoác Bomber', description: 'Áo khoác bomber đồng phục form rộng. Chất nỉ bông ấm áp.', price: 320000, sale_price: 280000, category: 'Áo Khoác', stock: 100, sku: 'AK-BOM-001' },
  { name: 'Áo Vest Nam 2 Lớp', description: 'Áo vest nam 2 lớp, form slim fit. Phù hợp cho lễ tân, sự kiện.', price: 650000, category: 'Veston / Blazer', stock: 80, sku: 'VS-NAM-001' },
  { name: 'Blazer Nữ', description: 'Blazer nữ công sở, thiết kế thanh lịch. Chất liệu cao cấp.', price: 550000, category: 'Veston / Blazer', stock: 60, sku: 'BL-NU-001' },
  { name: 'Áo Phản Quang Bảo Hộ', description: 'Áo phản quang bảo hộ lao động, đạt tiêu chuẩn ANSI. Phù hợp cho công nhân, bảo vệ.', price: 95000, category: 'Đồ Bảo Hộ Lao Động', stock: 500, sku: 'BH-PQ-001' },
  { name: 'Quần Bảo Hộ Lao Động', description: 'Quần bảo hộ lao động vải dù dày dặn, nhiều túi. Phù hợp cho công nhân xây dựng, nhà máy.', price: 110000, category: 'Đồ Bảo Hộ Lao Động', stock: 400, sku: 'BH-QN-001' },
  { name: 'Nón Bảo Hộ Lao Động', description: 'Nón bảo hộ lao động nhựa ABS, chịu lực tốt. In logo theo yêu cầu.', price: 35000, category: 'Phụ Kiện May Mặc', stock: 1000, sku: 'PK-NON-001' },
  { name: 'Khăn Đồng Phục', description: 'Khăn đồng phục in logo, chất liệu cotton mềm mại. Kích thước 50x50cm.', price: 25000, category: 'Phụ Kiện May Mặc', stock: 800, sku: 'PK-KHAN-001' },
  { name: 'Tạp Dề Đồng Phục', description: 'Tạp dề đồng phục cho nhà hàng, quán cafe. Chất vải kaki bền đẹp.', price: 65000, category: 'Phụ Kiện May Mặc', stock: 200, sku: 'PK-TD-001' },
];

async function seed() {
  console.log('=== XƯỞNG MAY NHÀ CÔNG - SEED DATA ===\n');

  const connection = await pool.getConnection();

  try {
    const categoryMap = {};

    for (const cat of CATEGORIES) {
      const [rows] = await connection.query('SELECT id FROM categories WHERE name = ?', [cat.name]);
      if (rows.length > 0) {
        categoryMap[cat.name] = rows[0].id;
        console.log(`Category exists: ${cat.name} (id: ${rows[0].id})`);
      } else {
        const [result] = await connection.query(
          'INSERT INTO categories (name, image) VALUES (?, ?)', [cat.name, cat.image]
        );
        categoryMap[cat.name] = result.insertId;
        console.log(`Created category: ${cat.name} (id: ${result.insertId})`);
      }
    }

    console.log(`\nInserting ${PRODUCTS.length} products...\n`);

    let inserted = 0;
    for (const product of PRODUCTS) {
      const categoryId = categoryMap[product.category];
      if (!categoryId) {
        console.error(`No category ID for "${product.category}"`);
        continue;
      }

      const [existing] = await connection.query('SELECT id FROM products WHERE sku = ?', [product.sku]);
      if (existing.length > 0) {
        console.log(`  EXISTS: ${product.name}`);
        continue;
      }

      await connection.query(
        'INSERT INTO products (name, description, price, sale_price, category_id, stock, sku) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.sale_price || null, categoryId, product.stock, product.sku]
      );
      console.log(`  INSERTED: ${product.name} - ${product.price.toLocaleString('vi-VN')}₫`);
      inserted++;
    }

    const adminPassword = await bcrypt.hash('admin123', 10);
    const [adminExists] = await connection.query('SELECT id FROM users WHERE email = ?', ['admin@xuongmaynhacong.com']);
    if (adminExists.length === 0) {
      await connection.query(
        'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
        ['Admin Xưởng May', 'admin@xuongmaynhacong.com', adminPassword, '0900000000', 'admin']
      );
      console.log('\nCreated admin user: admin@xuongmaynhacong.com / admin123');
    } else {
      console.log('\nAdmin user already exists');
    }

    const userPassword = await bcrypt.hash('customer123', 10);
    const [userExists] = await connection.query('SELECT id FROM users WHERE email = ?', ['customer@example.com']);
    if (userExists.length === 0) {
      await connection.query(
        'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
        ['Nguyễn Văn A', 'customer@example.com', userPassword, '0912345678', '123 Đường Láng, Đống Đa, Hà Nội', 'customer']
      );
      console.log('Created test customer: customer@example.com / customer123');
    }

    console.log(`\n=== COMPLETE: ${inserted} products inserted ===`);
  } finally {
    connection.release();
    await pool.end();
  }
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
