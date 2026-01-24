-- Initialize JonoSeba Database
-- This file runs automatically when MySQL container starts for the first time

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS jonoseba;

-- Switch to the database
USE jonoseba;

-- Grant privileges to application user
GRANT ALL PRIVILEGES ON jonoseba.* TO 'jonoseba'@'%';
FLUSH PRIVILEGES;

-- Database is ready
SELECT 'JonoSeba database initialized successfully!' AS message;
