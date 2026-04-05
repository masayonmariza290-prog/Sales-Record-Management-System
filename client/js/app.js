import { api } from './api.js';

const mainContent = document.getElementById('main-content');
const navLinks = document.querySelectorAll('nav ul li a');

// --- Routing ---
const routes = {
    dashboard: renderDashboard,
    products: renderProducts,
    customers: renderCustomers,
    categories: renderCategories,
    sales: renderSales
};

function navigate(route) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.id === `nav-${route}`) {
            link.classList.add('active');
        }
    });
    if (routes[route]) {
        routes[route]();
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = e.target.id.replace('nav-', '');
        navigate(route);
    });
});

// --- Dashboard ---
async function renderDashboard() {
    mainContent.innerHTML = '<h1>Dashboard</h1><div class="loading">Loading...</div>';
    try {
        const [sales, products, customers] = await Promise.all([
            api.getSales(),
            api.getProducts(),
            api.getCustomers()
        ]);

        const totalRevenue = Array.isArray(sales) ? sales.reduce((sum, s) => sum + parseFloat(s.total_amount), 0) : 0;
        const totalSalesCount = Array.isArray(sales) ? sales.length : 0;
        const lowStockProducts = Array.isArray(products) ? products.filter(p => p.stock_quantity < 50).length : 0;

        mainContent.innerHTML = `
            <h1>Dashboard</h1>
            <div class="dashboard-stats">
                <div class="stat-card"><h3>Total Revenue</h3><div class="value">₱${totalRevenue.toFixed(2)}</div></div>
                <div class="stat-card"><h3>Total Sales</h3><div class="value">${totalSalesCount}</div></div>
                <div class="stat-card"><h3>Total Customers</h3><div class="value">${Array.isArray(customers) ? customers.length : 0}</div></div>
                <div class="stat-card"><h3>Low Stock Alerts</h3><div class="value">${lowStockProducts}</div></div>
            </div>
            <div class="card">
                <h2>Recent Sales</h2>
                <table>
                    <thead><tr><th>Date</th><th>Customer</th><th>Total</th><th>Payment</th><th>Actions</th></tr></thead>
                    <tbody>
                        ${Array.isArray(sales) ? sales.slice(0, 5).map(s => `
                            <tr>
                                <td>${new Date(s.sale_date).toLocaleDateString()}</td>
                                <td>${s.first_name} ${s.last_name}</td>
                                <td>₱${s.total_amount}</td>
                                <td>${s.payment_method}</td>
                                <td>
                                    <button class="btn btn-sm edit-sale" data-id="${s.id}"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-sm delete-sale" data-id="${s.id}"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('') : ''}
                    </tbody>
                </table>
            </div>
        `;

        document.querySelectorAll('.edit-sale').forEach(btn => {
            btn.onclick = () => renderSaleForm(btn.dataset.id);
        });
        document.querySelectorAll('.delete-sale').forEach(btn => {
            btn.onclick = async () => {
                if (confirm('Delete this sale record? Stock will be reversed.')) {
                    await api.deleteSale(btn.dataset.id);
                    renderDashboard();
                }
            };
        });
    } catch (error) {
        mainContent.innerHTML = `<div class="error">Error loading dashboard: ${error.message}</div>`;
    }
}

// --- Products ---
async function renderProducts() {
    mainContent.innerHTML = '<h1>Products</h1><div class="loading">Loading...</div>';
    try {
        const products = await api.getProducts();
        const categories = await api.getCategories();

        mainContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h1>Products</h1>
                <button class="btn btn-primary" id="add-product-btn">Add Product</button>
            </div>
            <div class="card">
                <table>
                    <thead><tr><th>SKU</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                    <tbody>
                        ${Array.isArray(products) ? products.map(p => `
                            <tr>
                                <td>${p.sku}</td>
                                <td>${p.name}</td>
                                <td>${p.category_name || 'N/A'}</td>
                                <td>₱${p.price}</td>
                                <td>${p.stock_quantity}</td>
                                <td>
                                    <button class="btn btn-sm edit-product" data-id="${p.id}"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-sm delete-product" data-id="${p.id}"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('') : ''}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('add-product-btn').onclick = () => renderProductForm(categories);
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.onclick = () => renderProductForm(categories, btn.dataset.id);
        });
        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.onclick = async () => {
                if (confirm('Delete this product?')) {
                    try {
                        const res = await api.deleteProduct(btn.dataset.id);
                        if (res.error) alert(res.error);
                        renderProducts();
                    } catch (e) {
                        alert('Error deleting product');
                    }
                }
            };
        });
    } catch (error) {
        mainContent.innerHTML = `<div class="error">Error loading products: ${error.message}</div>`;
    }
}

async function renderProductForm(categories, productId = null) {
    let product = { sku: '', name: '', category_id: '', price: '', stock_quantity: '' };
    if (productId) {
        product = await api.getProduct(productId);
    }

    mainContent.innerHTML = `
        <h1>${productId ? 'Edit' : 'Add'} Product</h1>
        <div class="card">
            <form id="product-form">
                <div class="form-group"><label>SKU</label><input type="text" id="sku" value="${product.sku}" required></div>
                <div class="form-group"><label>Name</label><input type="text" id="name" value="${product.name}" required></div>
                <div class="form-group"><label>Category</label>
                    <select id="category_id">
                        ${categories.map(c => `<option value="${c.id}" ${c.id == product.category_id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Price</label><input type="number" step="0.01" id="price" value="${product.price}" required></div>
                <div class="form-group"><label>Stock Quantity</label><input type="number" id="stock_quantity" value="${product.stock_quantity}" required></div>
                <button type="submit" class="btn btn-primary">Save</button>
                <button type="button" class="btn" id="cancel-btn">Cancel</button>
            </form>
        </div>
    `;

    document.getElementById('cancel-btn').onclick = renderProducts;
    document.getElementById('product-form').onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            sku: document.getElementById('sku').value,
            name: document.getElementById('name').value,
            category_id: document.getElementById('category_id').value,
            price: parseFloat(document.getElementById('price').value),
            stock_quantity: parseInt(document.getElementById('stock_quantity').value)
        };
        productId ? await api.updateProduct(productId, data) : await api.createProduct(data);
        renderProducts();
    };
}

// --- Customers ---
async function renderCustomers() {
    mainContent.innerHTML = '<h1>Customers</h1><div class="loading">Loading...</div>';
    try {
        const customers = await api.getCustomers();
        mainContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h1>Customers</h1>
                <button class="btn btn-primary" id="add-customer-btn">Add Customer</button>
            </div>
            <div class="card">
                <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                        ${Array.isArray(customers) ? customers.map(c => `
                            <tr>
                                <td>${c.first_name} ${c.last_name}</td>
                                <td>${c.email}</td>
                                <td>${new Date(c.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button class="btn btn-sm edit-customer" data-id="${c.id}"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-sm delete-customer" data-id="${c.id}"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('') : ''}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('add-customer-btn').onclick = () => renderCustomerForm();
        document.querySelectorAll('.edit-customer').forEach(btn => {
            btn.onclick = () => renderCustomerForm(btn.dataset.id);
        });
        document.querySelectorAll('.delete-customer').forEach(btn => {
            btn.onclick = async () => {
                if (confirm('Delete this customer?')) {
                    const res = await api.deleteCustomer(btn.dataset.id);
                    if (res.error) alert(res.error);
                    renderCustomers();
                }
            };
        });
    } catch (error) {
        mainContent.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

async function renderCustomerForm(customerId = null) {
    let customer = { first_name: '', last_name: '', email: '' };
    if (customerId) customer = await api.getCustomer(customerId);

    mainContent.innerHTML = `
        <h1>${customerId ? 'Edit' : 'Add'} Customer</h1>
        <div class="card">
            <form id="customer-form">
                <div class="form-group"><label>First Name</label><input type="text" id="first_name" value="${customer.first_name}" required></div>
                <div class="form-group"><label>Last Name</label><input type="text" id="last_name" value="${customer.last_name}" required></div>
                <div class="form-group"><label>Email</label><input type="email" id="email" value="${customer.email}" required></div>
                <button type="submit" class="btn btn-primary">Save</button>
                <button type="button" class="btn" id="cancel-btn">Cancel</button>
            </form>
        </div>
    `;
    document.getElementById('cancel-btn').onclick = renderCustomers;
    document.getElementById('customer-form').onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            email: document.getElementById('email').value
        };
        customerId ? await api.updateCustomer(customerId, data) : await api.createCustomer(data);
        renderCustomers();
    };
}

// --- Categories ---
async function renderCategories() {
    mainContent.innerHTML = '<h1>Categories</h1><div class="loading">Loading...</div>';
    try {
        const categories = await api.getCategories();
        mainContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h1>Categories</h1>
                <button class="btn btn-primary" id="add-category-btn">Add Category</button>
            </div>
            <div class="card">
                <table>
                    <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
                    <tbody>
                        ${Array.isArray(categories) ? categories.map(c => `
                            <tr>
                                <td>${c.name}</td>
                                <td>${c.description || ''}</td>
                                <td>
                                    <button class="btn btn-sm edit-category" data-id="${c.id}"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-sm delete-category" data-id="${c.id}"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('') : ''}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('add-category-btn').onclick = () => renderCategoryForm();
        document.querySelectorAll('.edit-category').forEach(btn => {
            btn.onclick = () => renderCategoryForm(btn.dataset.id);
        });
        document.querySelectorAll('.delete-category').forEach(btn => {
            btn.onclick = async () => {
                if (confirm('Delete this category?')) {
                    const res = await api.deleteCategory(btn.dataset.id);
                    if (res.error) alert(res.error);
                    renderCategories();
                }
            };
        });
    } catch (error) {
        mainContent.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

async function renderCategoryForm(categoryId = null) {
    let category = { name: '', description: '' };
    if (categoryId) {
        const categories = await api.getCategories();
        category = categories.find(c => c.id == categoryId);
    }

    mainContent.innerHTML = `
        <h1>${categoryId ? 'Edit' : 'Add'} Category</h1>
        <div class="card">
            <form id="category-form">
                <div class="form-group"><label>Name</label><input type="text" id="name" value="${category.name}" required></div>
                <div class="form-group"><label>Description</label><textarea id="description">${category.description || ''}</textarea></div>
                <button type="submit" class="btn btn-primary">Save</button>
                <button type="button" class="btn" id="cancel-btn">Cancel</button>
            </form>
        </div>
    `;
    document.getElementById('cancel-btn').onclick = renderCategories;
    document.getElementById('category-form').onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value
        };
        categoryId ? await api.updateCategory(categoryId, data) : await api.createCategory(data);
        renderCategories();
    };
}

// --- Sales ---
async function renderSales() {
    mainContent.innerHTML = '<h1>Sales History</h1><div class="loading">Loading...</div>';
    try {
        const sales = await api.getSales();
        mainContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h1>Sales History</h1>
                <button class="btn btn-primary" id="new-sale-btn">New Sale</button>
            </div>
            <div class="card">
                <table>
                    <thead><tr><th>Date</th><th>Customer</th><th>Total</th><th>Payment</th><th>Actions</th></tr></thead>
                    <tbody>
                        ${Array.isArray(sales) ? sales.map(s => `
                            <tr>
                                <td>${new Date(s.sale_date).toLocaleString()}</td>
                                <td>${s.first_name} ${s.last_name}</td>
                                <td>₱${s.total_amount}</td>
                                <td>${s.payment_method}</td>
                                <td>
                                    <button class="btn btn-sm edit-sale" data-id="${s.id}"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-sm delete-sale" data-id="${s.id}"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('') : ''}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('new-sale-btn').onclick = () => renderSaleForm();
        document.querySelectorAll('.edit-sale').forEach(btn => {
            btn.onclick = () => renderSaleForm(btn.dataset.id);
        });
        document.querySelectorAll('.delete-sale').forEach(btn => {
            btn.onclick = async () => {
                if (confirm('Delete this sale record? Stock will be reversed.')) {
                    await api.deleteSale(btn.dataset.id);
                    renderSales();
                }
            };
        });
    } catch (error) {
        mainContent.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

async function renderSaleForm(saleId = null) {
    const [customers, products] = await Promise.all([api.getCustomers(), api.getProducts()]);
    let sale = { customer_id: '', payment_method: 'Cash', total_amount: 0, items: [] };
    
    if (saleId) {
        sale = await api.getSale(saleId);
    }

    mainContent.innerHTML = `
        <h1>${saleId ? 'Edit' : 'Record New'} Sale</h1>
        <div class="card">
            <form id="sale-form">
                <div class="form-group"><label>Customer</label>
                    <select id="customer_id" required>
                        ${customers.map(c => `<option value="${c.id}" ${c.id == sale.customer_id ? 'selected' : ''}>${c.first_name} ${c.last_name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Payment Method</label>
                    <select id="payment_method">
                        <option value="Cash" ${sale.payment_method === 'Cash' ? 'selected' : ''}>Cash</option>
                        <option value="Credit Card" ${sale.payment_method === 'Credit Card' ? 'selected' : ''}>Credit Card</option>
                        <option value="Debit Card" ${sale.payment_method === 'Debit Card' ? 'selected' : ''}>Debit Card</option>
                    </select>
                </div>
                <h3>Items</h3>
                <div id="sale-items-container"></div>
                <button type="button" class="btn" id="add-item-row-btn">+ Add Item</button>
                <div class="form-group" style="margin-top:1rem;"><label>Total Amount</label><input type="text" id="total_amount_display" readonly value="${parseFloat(sale.total_amount).toFixed(2)}"></div>
                <button type="submit" class="btn btn-primary">${saleId ? 'Update' : 'Complete'} Sale</button>
                <button type="button" class="btn" id="cancel-sale-btn">Cancel</button>
            </form>
        </div>
    `;

    document.getElementById('cancel-sale-btn').onclick = renderSales;

    const itemsContainer = document.getElementById('sale-items-container');
    const updateTotal = () => {
        let total = 0;
        document.querySelectorAll('.sale-item-row').forEach(row => {
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            const qty = parseInt(row.querySelector('.item-quantity').value) || 0;
            total += price * qty;
        });
        document.getElementById('total_amount_display').value = total.toFixed(2);
    };

    const addRow = (item = null) => {
        const row = document.createElement('div');
        row.className = 'sale-item-row';
        row.innerHTML = `
            <select class="item-product" required>
                ${products.map(p => `<option value="${p.id}" data-price="${p.price}" ${item && item.product_id == p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
            </select>
            <input type="number" class="item-quantity" min="1" value="${item ? item.quantity : 1}" required>
            <input type="text" class="item-price" readonly value="${item ? item.unit_price : (products[0] ? products[0].price : 0)}">
            <button type="button" class="btn remove-row-btn">×</button>
        `;
        itemsContainer.appendChild(row);
        const sel = row.querySelector('.item-product');
        sel.onchange = () => { row.querySelector('.item-price').value = sel.options[sel.selectedIndex].dataset.price; updateTotal(); };
        row.querySelector('.item-quantity').oninput = updateTotal;
        row.querySelector('.remove-row-btn').onclick = () => { row.remove(); updateTotal(); };
        updateTotal();
    };

    document.getElementById('add-item-row-btn').onclick = () => addRow();
    
    if (sale.items && sale.items.length > 0) {
        sale.items.forEach(item => addRow(item));
    } else {
        addRow();
    }

    document.getElementById('sale-form').onsubmit = async (e) => {
        e.preventDefault();
        const items = Array.from(document.querySelectorAll('.sale-item-row')).map(row => ({
            product_id: parseInt(row.querySelector('.item-product').value),
            quantity: parseInt(row.querySelector('.item-quantity').value),
            unit_price: parseFloat(row.querySelector('.item-price').value)
        }));
        const data = {
            customer_id: parseInt(document.getElementById('customer_id').value),
            payment_method: document.getElementById('payment_method').value,
            total_amount: parseFloat(document.getElementById('total_amount_display').value),
            items
        };
        saleId ? await api.updateSale(saleId, data) : await api.createSale(data);
        renderSales();
    };
}

navigate('dashboard');
