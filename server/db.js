const pg = require('pg');
const client = new pg.Client('postgres://localhost/the_acme_store');
const uuid = require('uuid');
const bcrypt = require('bcrypt');


const createTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS favorite;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) UNIQUE
    );
    CREATE TABLE products(
      id UUID PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    );
    CREATE TABLE favorite(
      id UUID PRIMARY KEY,
      product_id UUID REFERENCES products(id) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
    );
  `;
  await client.query(SQL);
};

const createUser = async({ name, username, password })=> {
    const SQL = `
      INSERT INTO users(id, name, username, password) VALUES($1, $2, $3, $4) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name, username, await bcrypt.hash(password, 5)]);
    return response.rows[0];
  }
  
  const createProduct = async({ name })=> {
    const SQL = `
      INSERT INTO products(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
  }

  const createUserFavorite = async({ user_id, product_id })=> {
    const SQL = `
      INSERT INTO favorite(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
    return response.rows[0];
  }

  const fetchUsers = async()=> {
    const SQL = `
      SELECT * FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
  }
  
  const fetchProducts = async()=> {
    const SQL = `
      SELECT * FROM products;
    `;
    const response = await client.query(SQL);
    return response.rows;
  }

  const fetchUserFavorite = async(id)=> {
    const SQL = `
      SELECT * FROM favorite
      WHERE user_id = $1
    `;
    const response = await client.query(SQL, [ id ]);
    return response.rows;
  }

  const deleteUserFavorite = async({id, user_id})=> {
    const SQL = `
      DELETE FROM favorite
      WHERE id = $1 AND user_id = $2
    `;
    await client.query(SQL, [ id, user_id ]);
  }
  

module.exports = {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  fetchUserFavorite,
  createUserFavorite,
  deleteUserFavorite
};