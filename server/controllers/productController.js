const pool = require('../config/db');

exports.getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id');
        res.json(rows);
    } catch (error) {
        console.error('GET /api/products error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    const { sku, name, price, stock_quantity, category_id } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO products (sku, name, price, stock_quantity, category_id) VALUES (?, ?, ?, ?, ?)',
            [sku, name, price, stock_quantity, category_id]
        );
        res.status(201).json({ id: result.insertId, sku, name, price, stock_quantity, category_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const { sku, name, price, stock_quantity, category_id } = req.body;
    try {
        await pool.query(
            'UPDATE products SET sku = ?, name = ?, price = ?, stock_quantity = ?, category_id = ? WHERE id = ?',
            [sku, name, price, stock_quantity, category_id, req.params.id]
        );
        res.json({ id: req.params.id, sku, name, price, stock_quantity, category_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        // Check if product is used in any sales
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM sale_items WHERE product_id = ?', [id]);
        if (rows[0].count > 0) {
            return res.status(400).json({ error: 'Cannot delete product: it is linked to existing sale records. Please delete the sales first.' });
        }
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: error.message });
    }
};
