export const userModelTable = `CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email  VARCHAR(255) UNIQUE,
    password VARCHAR(255)
)`