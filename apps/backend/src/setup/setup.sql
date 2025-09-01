CREATE DATABASE IF NOT EXISTS ease_analytics_db;

USE ease_analytics_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY_KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  
);

CREATE TABLE IF NOT EXISTS websites (
    id BIGINT AUTO_INCREMENT PRIMARY_KEY,
    user_id BIGINT NOT NULL,
    site_name VARCHAR(150) NOT NULL,
    site_url VARCHAR(255) NOT NULL,
    site_key CHAR(36) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE  
);

CREATE TABLE IF NOT EXISTS page_views (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    website_id BIGINT NOT NULL,
    visitor_id CHAR(36) NOT NULL,
    page_url VARCHAR(500) NOT NULL,
    referrer VARCHAR(500),
    device_type ENUM("desktop", "mobile", "tablet") NOT NULL,
    browser VARCHAR(100),
    os VARCHAR(100),
    country CHAR(2),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE,
    INDEX (website_id, viewed_at),
    INDEX (visitor_id)
);
