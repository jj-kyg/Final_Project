// require in the database adapter functions
const client = require('./client');

async function dropTables() {
  console.log("Dropping All Tables...");
  // drop all tables, in the correct order
  try {
    await client.query(`
      DROP TABLE IF EXISTS order_description;
      DROP TABLE IF EXISTS order_art;
      DROP TABLE IF EXISTS artwork;
      DROP TABLE IF EXISTS keywords;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS images;
      DROP TABLE IF EXISTS category;
      DROP TABLE IF EXISTS customers;
`);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  console.log("Starting to build tables...");
  // create all tables, in the correct order
  try {
    await client.query(`
    CREATE TABLE customers (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      "firstName" VARCHAR(255) NOT NULL,
      "lastName" VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      address VARCHAR(255),
      postal INTEGER,
      city VARCHAR(255),
      phone VARCHAR(255),
      "isActive" BOOLEAN DEFAULT 'false',
      "isAdmin" BOOLEAN DEFAULT 'false'
    );
    
    CREATE TABLE category (
      id SERIAL PRIMARY KEY,
      category VARCHAR(255) NOT NULL,
      description VARCHAR(255)
    );
    
    CREATE TABLE images (
      id SERIAL PRIMARY KEY,
      image VARCHAR(255) UNIQUE
    );
    
    CREATE TABLE reviews (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) REFERENCES customers(username),
      rating INTEGER,
      description VARCHAR(255),
      date DATE
    );

    CREATE TABLE keywords (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE
    );
    
    CREATE TABLE artwork (
      id SERIAL PRIMARY KEY,
      "isActive" Boolean,
      name VARCHAR(255) UNIQUE NOT NULL,
      description VARCHAR(255),
      price INTEGER NOT NULL,
      featured Boolean,
      stock INTEGER NOT NULL,
      keyword VARCHAR(255) REFERENCES keywords(name),
      "categoryId" INTEGER REFERENCES category(id),
      "imageId" INTEGER REFERENCES images(id),
      "reviewId" INTEGER REFERENCES reviews(id)
    );
    
    CREATE TABLE order_art (
      id SERIAL PRIMARY KEY,
      date DATE,
      "customerId" INTEGER REFERENCES customers(id),
      "shipmentDate" DATE NOT NULL,
      "deliveryStatus" BOOLEAN
    );
    
    CREATE TABLE order_description (
      id SERIAL PRIMARY KEY,
      "artworkId" INTEGER REFERENCES artwork(id),
      quantity INTEGER,
      price INTEGER,
      "orderId" INTEGER REFERENCES order_art(id), 
      total INTEGER
    );
`);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
  } catch (error) {
    console.log('Error during rebuildDB')
    throw error;
  }
}

module.exports = {
  rebuildDB
};
