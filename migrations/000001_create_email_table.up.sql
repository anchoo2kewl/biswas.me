CREATE TABLE IF NOT EXISTS email(
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
message TEXT,
date TIMESTAMP,
ip VARCHAR(20) NOT NULL
);