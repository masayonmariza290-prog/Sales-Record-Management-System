const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Try loading .env from root and current directory
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

async function initDB() {
    const dbName = process.env.DB_NAME || 'sales_record_management_system_db';
    
    // 1. Connect without database first
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    try {
        console.log('Connecting to MySQL...');
        
        // 2. Create the database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`Database "${dbName}" created or already exists.`);

        // 3. Switch to the database
        await connection.query(`USE ${dbName}`);

        // 4. Read and run the schema
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await connection.query(schema);
        
        // Ensure description column exists (for existing databases)
        try {           
            await connection.query('ALTER TABLE categories ADD COLUMN description TEXT');
            console.log('Added description column to categories table.');
        } catch (e) {}

        // Ensure created_at column exists for customers
        try {
            await connection.query('ALTER TABLE customers ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
            console.log('Added created_at column to customers table.');
        } catch (e) {}

        console.log('Database schema initialized successfully.');

        // 5. Seed initial categories if empty
        const [categories] = await connection.query('SELECT COUNT(*) as count FROM categories');
        if (categories[0].count === 0) {
            await connection.query(`INSERT INTO categories (name) VALUES 
                ('Electronics'), ('Office Supplies'), ('Accessories'), ('Bags'), 
                ('Footwear'), ('Apparel'), ('Home & Kitchen'), ('Home & Office'), 
                ('Wearables'), ('Furniture'), ('Baby Products')`);
            console.log('Sample categories seeded.');
        }

        // 6. Seed initial customer if empty
        const [customers] = await connection.query('SELECT COUNT(*) as count FROM customers');
        if (customers[0].count === 0) {
            await connection.query("INSERT INTO customers (email, first_name, last_name) VALUES ('walkin@example.com', 'Walk-in', 'Customer')");
            console.log('Sample customer seeded.');
        }

        // 7. Seed initial products if empty
        const [products] = await connection.query('SELECT COUNT(*) as count FROM products');
        if (products[0].count === 0) {
            // Get category mappings
            const [catRows] = await connection.query('SELECT id, name FROM categories');
            const catMap = {};
            catRows.forEach(row => catMap[row.name] = row.id);

            const productData = [
                ['ELEC001', 'Wireless Bluetooth Speaker', 1299, 45, 'Electronics'],
                ['ELEC002', 'USB-C Fast Charger', 799, 60, 'Electronics'],
                ['ELEC003', 'Portable Power Bank 20000mAh', 1499, 35, 'Electronics'],
                ['ELEC004', 'Gaming Mouse RGB', 950, 50, 'Electronics'],
                ['ELEC005', 'Mechanical Keyboard', 2200, 25, 'Electronics'],
                ['OFF001', 'A4 Bond Paper Ream', 250, 100, 'Office Supplies'],
                ['OFF002', 'Ballpen Set (10 pcs)', 120, 80, 'Office Supplies'],
                ['OFF003', 'Stapler Heavy Duty', 180, 40, 'Office Supplies'],
                ['OFF004', 'Desk Organizer Tray', 320, 30, 'Office Supplies'],
                ['OFF005', 'Whiteboard Marker Set', 150, 55, 'Office Supplies'],
                ['ACC001', 'Phone Case Shockproof', 350, 70, 'Accessories'],
                ['ACC002', 'Laptop Sleeve 15-inch', 650, 28, 'Accessories'],
                ['ACC003', 'Wireless Earbuds', 1800, 20, 'Accessories'],
                ['ACC004', 'HDMI Cable 2m', 220, 65, 'Accessories'],
                ['ACC005', 'USB Hub 4-Port', 450, 33, 'Accessories'],
                ['BAG001', 'Travel Backpack 40L', 1800, 18, 'Bags'],
                ['BAG002', 'Laptop Backpack Waterproof', 1450, 22, 'Bags'],
                ['BAG003', 'Tote Bag Canvas', 550, 40, 'Bags'],
                ['BAG004', 'Sling Bag Leather', 980, 26, 'Bags'],
                ['BAG005', 'Duffel Gym Bag', 1250, 15, 'Bags'],
                ['FOO001', 'Running Shoes Men', 2500, 20, 'Footwear'],
                ['FOO002', 'Casual Sneakers Women', 2200, 18, 'Footwear'],
                ['FOO003', 'Rubber Sandals', 450, 60, 'Footwear'],
                ['FOO004', 'Formal Leather Shoes', 3200, 12, 'Footwear'],
                ['FOO005', 'Slip-On Loafers', 1700, 25, 'Footwear'],
                ['APP001', 'Cotton T-Shirt Black', 399, 75, 'Apparel'],
                ['APP002', 'Denim Jacket', 1500, 20, 'Apparel'],
                ['APP003', 'Jogger Pants', 850, 35, 'Apparel'],
                ['APP004', 'Polo Shirt Blue', 650, 40, 'Apparel'],
                ['APP005', 'Hoodie Unisex', 1200, 18, 'Apparel'],
                ['HK001', 'Rice Cooker 1.8L', 2100, 16, 'Home & Kitchen'],
                ['HK002', 'Non-Stick Frying Pan', 950, 30, 'Home & Kitchen'],
                ['HK003', 'Electric Kettle', 1200, 24, 'Home & Kitchen'],
                ['HK004', 'Knife Set Stainless', 780, 22, 'Home & Kitchen'],
                ['HK005', 'Food Storage Containers', 600, 50, 'Home & Kitchen'],
                ['HO001', 'LED Desk Lamp', 890, 32, 'Home & Office'],
                ['HO002', 'Wall Clock Minimalist', 550, 27, 'Home & Office'],
                ['HO003', 'Extension Cord 5-Socket', 650, 45, 'Home & Office'],
                ['HO004', 'Mini Air Purifier', 1800, 14, 'Home & Office'],
                ['HO005', 'Foldable Storage Box', 420, 38, 'Home & Office'],
                ['WEAR001', 'Smartwatch Fitness Tracker', 2500, 21, 'Wearables'],
                ['WEAR002', 'Bluetooth Smart Band', 1800, 25, 'Wearables'],
                ['WEAR003', 'Wireless Sports Earphones', 1350, 29, 'Wearables'],
                ['WEAR004', 'Sleep Monitoring Band', 2100, 17, 'Wearables'],
                ['WEAR005', 'GPS Fitness Watch', 3900, 10, 'Wearables'],
                ['FUR001', 'Office Chair Ergonomic', 4500, 12, 'Furniture'],
                ['FUR002', 'Computer Table Wooden', 5200, 8, 'Furniture'],
                ['BAB001', 'Baby Feeding Bottle Set', 750, 35, 'Baby Products'],
                ['BAB002', 'Baby Diaper Bag', 1200, 20, 'Baby Products'],
                ['BAB003', 'Baby Stroller Foldable', 4800, 6, 'Baby Products']
            ];

            for (const [sku, name, price, stock, categoryName] of productData) {
                await connection.query(
                    'INSERT INTO products (sku, name, price, stock_quantity, category_id) VALUES (?, ?, ?, ?, ?)',
                    [sku, name, price, stock, catMap[categoryName]]
                );
            }
            console.log('Sample products seeded.');
        }

        // 8. Seed initial sales if empty
        const [sales] = await connection.query('SELECT COUNT(*) as count FROM sales');
        if (sales[0].count === 0) {
            const salesData = [
                ['2026-01-03', 'Juan Dela Cruz', 1, 'Cash', 'Wireless Bluetooth Speaker', 1299],
                ['2026-01-04', 'Maria Santos', 2, 'GCash', 'Ballpen Set (10 pcs)', 240],
                ['2026-01-05', 'Carlo Reyes', 1, 'Credit Card', 'Wireless Earbuds', 1800],
                ['2026-01-06', 'Ana Lopez', 1, 'Cash', 'Laptop Backpack Waterproof', 1450],
                ['2026-01-07', 'Mark Ramos', 1, 'Debit Card', 'Running Shoes Men', 2500],
                ['2026-01-08', 'Bea Cruz', 2, 'GCash', 'Jogger Pants', 1700],
                ['2026-01-09', 'Kevin Flores', 1, 'Cash', 'Rice Cooker 1.8L', 2100],
                ['2026-01-10', 'Jasmine Garcia', 1, 'Credit Card', 'LED Desk Lamp', 890],
                ['2026-01-11', 'Ryan Torres', 1, 'GCash', 'Smartwatch Fitness Tracker', 2500],
                ['2026-01-12', 'Nicole Mendoza', 1, 'Debit Card', 'Office Chair Ergonomic', 4500],
                ['2026-01-13', 'Angel Bautista', 3, 'Cash', 'Baby Feeding Bottle Set', 2250],
                ['2026-01-14', 'John Perez', 1, 'Credit Card', 'Mechanical Keyboard', 2200],
                ['2026-01-15', 'Claire Lim', 5, 'Cash', 'A4 Bond Paper Ream', 1250],
                ['2026-01-16', 'David Aquino', 2, 'GCash', 'Laptop Sleeve 15-inch', 1300],
                ['2026-01-17', 'Patricia Gomez', 1, 'Debit Card', 'Sling Bag Leather', 980],
                ['2026-01-18', 'Michael Tan', 1, 'Cash', 'Formal Leather Shoes', 3200],
                ['2026-01-19', 'Sophia Lee', 1, 'Credit Card', 'Hoodie Unisex', 1200],
                ['2026-01-20', 'Daniel Cruz', 1, 'GCash', 'Non-Stick Frying Pan', 950],
                ['2026-01-21', 'Erika Santos', 2, 'Cash', 'Extension Cord 5-Socket', 1300],
                ['2026-01-22', 'Joshua Ramos', 1, 'Debit Card', 'Bluetooth Smart Band', 1800],
                ['2026-01-23', 'Mia Torres', 1, 'Credit Card', 'Computer Table Wooden', 5200],
                ['2026-01-24', 'Ethan Garcia', 1, 'Cash', 'Baby Diaper Bag', 1200],
                ['2026-01-25', 'Hannah Flores', 1, 'GCash', 'Portable Power Bank 20000mAh', 1499],
                ['2026-01-26', 'Nathan Lopez', 2, 'Cash', 'Stapler Heavy Duty', 360],
                ['2026-01-27', 'Chloe Mendoza', 3, 'Debit Card', 'USB Hub 4-Port', 1350],
                ['2026-01-28', 'Liam Perez', 1, 'Credit Card', 'Duffel Gym Bag', 1250],
                ['2026-01-29', 'Grace Bautista', 1, 'Cash', 'Slip-On Loafers', 1700],
                ['2026-01-30', 'Sean Aquino', 2, 'GCash', 'Polo Shirt Blue', 1300],
                ['2026-01-31', 'Ella Gomez', 1, 'Debit Card', 'Knife Set Stainless', 780],
                ['2026-02-01', 'Jacob Tan', 1, 'Credit Card', 'Mini Air Purifier', 1800],
                ['2026-02-02', 'Zoe Lee', 1, 'Cash', 'GPS Fitness Watch', 3900],
                ['2026-02-03', 'Caleb Cruz', 1, 'GCash', 'Office Chair Ergonomic', 4500],
                ['2026-02-04', 'Faith Santos', 1, 'Debit Card', 'Baby Stroller Foldable', 4800],
                ['2026-02-05', 'Lucas Ramos', 2, 'Cash', 'Gaming Mouse RGB', 1900],
                ['2026-02-06', 'Ava Torres', 4, 'Credit Card', 'Desk Organizer Tray', 1280],
                ['2026-02-07', 'Noah Garcia', 2, 'GCash', 'Phone Case Shockproof', 700],
                ['2026-02-08', 'Lily Flores', 1, 'Cash', 'Tote Bag Canvas', 550],
                ['2026-02-09', 'Gabriel Lopez', 1, 'Debit Card', 'Casual Sneakers Women', 2200],
                ['2026-02-10', 'Scarlett Mendoza', 3, 'Cash', 'Cotton T-Shirt Black', 1197],
                ['2026-02-11', 'Elijah Perez', 2, 'Credit Card', 'Food Storage Containers', 1200],
                ['2026-02-12', 'Stella Bautista', 2, 'GCash', 'Foldable Storage Box', 840],
                ['2026-02-13', 'Isaac Aquino', 1, 'Debit Card', 'Sleep Monitoring Band', 2100],
                ['2026-02-14', 'Penelope Gomez', 1, 'Cash', 'Computer Table Wooden', 5200],
                ['2026-02-15', 'Julian Tan', 2, 'Credit Card', 'Baby Feeding Bottle Set', 1500],
                ['2026-02-16', 'Victoria Lee', 1, 'GCash', 'USB-C Fast Charger', 799],
                ['2026-02-17', 'Aaron Cruz', 3, 'Cash', 'Whiteboard Marker Set', 450],
                ['2026-02-18', 'Natalie Santos', 2, 'Debit Card', 'HDMI Cable 2m', 440],
                ['2026-02-19', 'Christian Ramos', 1, 'Credit Card', 'Travel Backpack 40L', 1800],
                ['2026-02-20', 'Samantha Torres', 1, 'Cash', 'Running Shoes Men', 2500],
                ['2026-02-21', 'Dominic Garcia', 1, 'GCash', 'Denim Jacket', 1500]
            ];

            // Get product name -> id/price mapping
            const [prodRows] = await connection.query('SELECT id, name, price FROM products');
            const prodMap = {};
            prodRows.forEach(row => prodMap[row.name] = { id: row.id, price: row.price });

            for (const [date, customerName, quantity, paymentMethod, productName, totalAmount] of salesData) {
                // 1. Handle Customer
                const nameParts = customerName.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ') || 'Customer';
                const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/ /g, '')}@example.com`;

                // Check if customer exists
                let [custRows] = await connection.query('SELECT id FROM customers WHERE email = ?', [email]);
                let customerId;
                if (custRows.length === 0) {
                    const [res] = await connection.query(
                        'INSERT INTO customers (email, first_name, last_name) VALUES (?, ?, ?)',
                        [email, firstName, lastName]
                    );
                    customerId = res.insertId;
                } else {
                    customerId = custRows[0].id;
                }

                // 2. Insert Sale
                const [saleRes] = await connection.query(
                    'INSERT INTO sales (customer_id, sale_date, total_amount, payment_method) VALUES (?, ?, ?, ?)',
                    [customerId, date, totalAmount, paymentMethod]
                );
                const saleId = saleRes.insertId;

                // 3. Insert Sale Item
                const product = prodMap[productName];
                if (product) {
                    await connection.query(
                        'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                        [saleId, product.id, quantity, product.price]
                    );
                    
                    // 4. Update Stock
                    await connection.query(
                        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                        [quantity, product.id]
                    );
                }
            }
            console.log('Sample sales seeded.');
        }

    } catch (error) {
        console.error('Error during database initialization:', error.message);
    } finally {
        await connection.end();
        process.exit();
    }
}

initDB();
