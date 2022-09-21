CREATE TYPE mod AS ENUM ('active', 'complete');
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users (id),
  status mod NOT NULL
);
