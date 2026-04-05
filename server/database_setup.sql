-- Sales Record Management System - Database Setup Script
-- This script creates the database, tables, and populates them with initial sample data.

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS sales_record_management_system_db;
USE sales_record_management_system_db;

-- 2. Create Tables
-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales Table
CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Sale Items Table (Junction table for Sales and Products)
CREATE TABLE IF NOT EXISTS sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- 3. Seed Initial Data
-- Insert Categories
INSERT INTO categories (name) VALUES ('Electronics'), ('Office Supplies'), ('Accessories');

-- Insert Products
INSERT INTO products (sku, name, price, stock_quantity, category_id) VALUES 
('LPT-001', 'High-Performance Laptop', 1200.00, 50, 1),
('MSE-002', 'Wireless Mouse', 25.50, 200, 3),
('MNR-003', '27-inch 4K Monitor', 350.00, 30, 1),
('PEN-004', 'Premium Gel Pen Set', 15.00, 500, 2);

-- Insert Customers
INSERT INTO customers (email, first_name, last_name) VALUES 
('john.doe@example.com', 'John', 'Doe'),
('jane.smith@example.com', 'Jane', 'Smith');

-- Insert a Sample Sale
INSERT INTO sales (customer_id, total_amount, payment_method) VALUES (1, 1225.50, 'Credit Card');
SET @last_sale_id = LAST_INSERT_ID();

INSERT INTO sale_items (sale_id, product_id, quantity, unit_price) VALUES 
(@last_sale_id, 1, 1, 1200.00),
(@last_sale_id, 2, 1, 25.50);
