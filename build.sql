BEGIN;
DROP TABLE IF EXISTS users, accounts;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  balance NUMERIC(10,2) NOT NULL DEFAULT 0.00
);

INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
INSERT INTO accounts (user_id, balance) VALUES (1, 1000.00);
INSERT INTO accounts (user_id, balance) VALUES (2, 500.00);
COMMIT;

