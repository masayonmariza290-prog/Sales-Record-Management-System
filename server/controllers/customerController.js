const pool = require('../config/db');

exports.getAllCustomers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching customer by id:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.createCustomer = async (req, res) => {
    const { email, first_name, last_name } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO customers (email, first_name, last_name) VALUES (?, ?, ?)',
            [email, first_name, last_name]
        );
        res.status(201).json({ id: result.insertId, email, first_name, last_name });
    } catch (error) {
        console.error('Error creating customer:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Customer with this email already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    const { email, first_name, last_name } = req.body;
    const { id } = req.params;
    try {
        await pool.query(
            'UPDATE customers SET email = ?, first_name = ?, last_name = ? WHERE id = ?',
            [email, first_name, last_name, id]
        );
        res.json({ id, email, first_name, last_name });
    } catch (error) {
        console.error('Error updating customer:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Another customer with this email already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        // Check if customer has any sales
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM sales WHERE customer_id = ?', [id]);
        if (rows[0].count > 0) {
            return res.status(400).json({ error: 'Cannot delete customer: they have existing sale records. Please delete the sales first.' });
        }
        await pool.query('DELETE FROM customers WHERE id = ?', [id]);
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ error: error.message });
    }
};
