const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const data = `ELEC001	Wireless Bluetooth Speaker	Electronics	1299	45
ELEC002	USB-C Fast Charger	Electronics	799	60
ELEC003	Portable Power Bank 20000mAh	Electronics	1499	35
ELEC004	Gaming Mouse RGB	Electronics	950	50
ELEC005	Mechanical Keyboard	Electronics	2200	25
OFF001	A4 Bond Paper Ream	Office Supplies	250	100
OFF002	Ballpen Set (10 pcs)	Office Supplies	120	80
OFF003	Stapler Heavy Duty	Office Supplies	180	40
OFF004	Desk Organizer Tray	Office Supplies	320	30
OFF005	Whiteboard Marker Set	Office Supplies	150	55
ACC001	Phone Case Shockproof	Accessories	350	70
ACC002	Laptop Sleeve 15-inch	Accessories	650	28
ACC003	Wireless Earbuds	Accessories	1800	20
ACC004	HDMI Cable 2m	Accessories	220	65
ACC005	USB Hub 4-Port	Accessories	450	33
BAG001	Travel Backpack 40L	Bags	1800	18
BAG002	Laptop Backpack Waterproof	Bags	1450	22
BAG003	Tote Bag Canvas	Bags	550	40
BAG004	Sling Bag Leather	Bags	980	26
BAG005	Duffel Gym Bag	Bags	1250	15
FOO001	Running Shoes Men	Footwear	2500	20
FOO002	Casual Sneakers Women	Footwear	2200	18
FOO003	Rubber Sandals	Footwear	450	60
FOO004	Formal Leather Shoes	Footwear	3200	12
FOO005	Slip-On Loafers	Footwear	1700	25
APP001	Cotton T-Shirt Black	Apparel	399	75
APP002	Denim Jacket	Apparel	1500	20
APP003	Jogger Pants	Apparel	850	35
APP004	Polo Shirt Blue	Apparel	650	40
APP005	Hoodie Unisex	Apparel	1200	18
HK001	Rice Cooker 1.8L	Home & Kitchen	2100	16
HK002	Non-Stick Frying Pan	Home & Kitchen	950	30
HK003	Electric Kettle	Home & Kitchen	1200	24
HK004	Knife Set Stainless	Home & Kitchen	780	22
HK005	Food Storage Containers	Home & Kitchen	600	50
HO001	LED Desk Lamp	Home & Office	890	32
HO002	Wall Clock Minimalist	Home & Office	550	27
HO003	Extension Cord 5-Socket	Home & Office	650	45
HO004	Mini Air Purifier	Home & Office	1800	14
HO005	Foldable Storage Box	Home & Office	420	38
WEAR001	Smartwatch Fitness Tracker	Wearables	2500	21
WEAR002	Bluetooth Smart Band	Wearables	1800	25
WEAR003	Wireless Sports Earphones	Wearables	1350	29
WEAR004	Sleep Monitoring Band	Wearables	2100	17
WEAR005	GPS Fitness Watch	Wearables	3900	10
FUR001	Office Chair Ergonomic	Furniture	4500	12
FUR002	Computer Table Wooden	Furniture	5200	8
BAB001	Baby Feeding Bottle Set	Baby Products	750	35
BAB002	Baby Diaper Bag	Baby Products	1200	20
BAB003	Baby Stroller Foldable	Baby Products	4800	6`;

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        const rows = data.split('\n').filter(row => row.trim() !== '');
        const categories = new Set();
        const products = rows.map(row => {
            const [sku, name, category, price, stock] = row.split('\t');
            categories.add(category);
            return { sku, name, category, price, stock };
        });

        // 1. Insert unique categories
        for (const category of categories) {
            await connection.execute(
                'INSERT IGNORE INTO categories (name) VALUES (?)',
                [category]
            );
        }

        // 2. Get all categories to map name -> id
        const [categoryRows] = await connection.execute('SELECT id, name FROM categories');
        const categoryMap = {};
        categoryRows.forEach(row => {
            categoryMap[row.name] = row.id;
        });

        // 3. Insert products
        for (const product of products) {
            await connection.execute(
                'INSERT INTO products (sku, name, price, stock_quantity, category_id) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, price=?, stock_quantity=?, category_id=?',
                [
                    product.sku, product.name, product.price, product.stock, categoryMap[product.category],
                    product.name, product.price, product.stock, categoryMap[product.category]
                ]
            );
        }

        console.log('Successfully seeded categories and products.');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await connection.end();
    }
}

seed();
