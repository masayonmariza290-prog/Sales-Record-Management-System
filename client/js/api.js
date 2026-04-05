const API_URL = 'http://localhost:3000/api';

export const api = {
    // Products
    async getProducts() {
        const response = await fetch(`${API_URL}/products`);
        return response.json();
    },
    async getProduct(id) {
        const response = await fetch(`${API_URL}/products/${id}`);
        return response.json();
    },
    async createProduct(product) {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        return response.json();
    },
    async updateProduct(id, product) {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        return response.json();
    },
    async deleteProduct(id) {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    // Customers
    async getCustomers() {
        const response = await fetch(`${API_URL}/customers`);
        return response.json();
    },
    async getCustomer(id) {
        const response = await fetch(`${API_URL}/customers/${id}`);
        return response.json();
    },
    async createCustomer(customer) {
        const response = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer)
        });
        return response.json();
    },
    async updateCustomer(id, customer) {
        const response = await fetch(`${API_URL}/customers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer)
        });
        return response.json();
    },
    async deleteCustomer(id) {
        const response = await fetch(`${API_URL}/customers/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    // Sales
    async getSales() {
        const response = await fetch(`${API_URL}/sales`);
        return response.json();
    },
    async getSale(id) {
        const response = await fetch(`${API_URL}/sales/${id}`);
        return response.json();
    },
    async createSale(sale) {
        const response = await fetch(`${API_URL}/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sale)
        });
        return response.json();
    },
    async updateSale(id, sale) {
        const response = await fetch(`${API_URL}/sales/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sale)
        });
        return response.json();
    },
    async deleteSale(id) {
        const response = await fetch(`${API_URL}/sales/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    },

    // Categories
    async getCategories() {
        const response = await fetch(`${API_URL}/categories`);
        return response.json();
    },
    async createCategory(category) {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category)
        });
        return response.json();
    },
    async updateCategory(id, category) {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category)
        });
        return response.json();
    },
    async deleteCategory(id) {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }
};
