
CREATE DATABASE pg_test_db WITH ENCODING = UTF8;

-- \c pg_test_db

CREATE TABLE pg_test (
    id SERIAL PRIMARY KEY,
    val NUMERIC,
    detail JSONB
);

