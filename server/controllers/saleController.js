const pool = require('../config/db');

exports.getAllSales = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.*, c.first_name, c.last_name 
            FROM sales s 
            LEFT JOIN customers c ON s.customer_id = c.id
            ORDER BY s.sale_date DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSaleById = async (req, res) => {
    const { id } = req.params;
    try {
        const [saleRows] = await pool.query('SELECT * FROM sales WHERE id = ?', [id]);
        if (saleRows.length === 0) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        const [itemRows] = await pool.query(`
            SELECT si.*, p.name as product_name 
            FROM sale_items si
            JOIN products p ON si.product_id = p.id
            WHERE si.sale_id = ?
        `, [id]);
        res.json({ ...saleRows[0], items: itemRows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSale = async (req, res) => {
    const { customer_id, items, total_amount, payment_method } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [saleResult] = await connection.query(
            'INSERT INTO sales (customer_id, total_amount, payment_method) VALUES (?, ?, ?)',
            [customer_id, total_amount, payment_method]
        );
        const saleId = saleResult.insertId;

        for (const item of items) {
            await connection.query(
                'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                [saleId, item.product_id, item.quantity, item.unit_price]
            );

            await connection.query(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();
        res.status(201).json({ id: saleId, customer_id, total_amount, payment_method, items });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

exports.updateSale = async (req, res) => {
    const { id } = req.params;
    const { customer_id, items, total_amount, payment_method } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Get original items to reverse stock changes
        const [originalItems] = await connection.query('SELECT * FROM sale_items WHERE sale_id = ?', [id]);
        for (const item of originalItems) {
            await connection.query(
                'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Update the sale record
        await connection.query(
            'UPDATE sales SET customer_id = ?, total_amount = ?, payment_method = ? WHERE id = ?',
            [customer_id, total_amount, payment_method, id]
        );

        // Remove old items
        await connection.query('DELETE FROM sale_items WHERE sale_id = ?', [id]);

        // Add new items and apply new stock changes
        for (const item of items) {
            await connection.query(
                'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                [id, item.product_id, item.quantity, item.unit_price]
            );

            await connection.query(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();
        res.json({ id, customer_id, total_amount, payment_method, items });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

exports.deleteSale = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Reverse stock changes
        const [originalItems] = await connection.query('SELECT * FROM sale_items WHERE sale_id = ?', [id]);
        for (const item of originalItems) {
            await connection.query(
                'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        // Delete items and the sale
        await connection.query('DELETE FROM sale_items WHERE sale_id = ?', [id]);
        await connection.query('DELETE FROM sales WHERE id = ?', [id]);

        await connection.commit();
        res.json({ message: 'Sale deleted successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};
