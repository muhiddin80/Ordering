export const CategoryTableModel = 
    `CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255)  NOT NULL UNIQUE,
        image VARCHAR(255),
        category_id INT REFERENCES categories(id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION 
    );`