// require in the database adapter functions
const client = require('./client');
const { createCustomer, getCustomerById } = require('./customers');
const { createProduct } = require('./products');
const { createReview } = require('./reviews');
const { createCategory } = require('./categories');

async function dropTables() {
  console.log("Dropping All Tables...");
  // drop all tables, in the correct order
  try {
    await client.query(`
      DROP TABLE IF EXISTS product_keywords;
      DROP TABLE IF EXISTS keywords;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS products;
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

    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      "isActive" BOOLEAN DEFAULT true,
      name VARCHAR(255) UNIQUE NOT NULL,
      artist VARCHAR(255) NOT NULL,
      img TEXT,
      description TEXT,
      price VARCHAR(255) NOT NULL,
      featured BOOLEAN DEFAULT false,
      stock INTEGER NOT NULL
    );

    CREATE TABLE reviews (
      id SERIAL PRIMARY KEY,
      "reviewId" INTEGER REFERENCES products(id) NOT NULL,
      username VARCHAR(255),
      rating INTEGER,
      description TEXT
    );
    
    CREATE TABLE categories (
      id SERIAL PRIMARY KEY,
      "categoryId" INTEGER REFERENCES products(id),
      "categoryName" VARCHAR(255) NOT NULL,
      description VARCHAR(255)
    );

    CREATE TABLE keywords (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
    );
    
    CREATE TABLE product_keywords (
      "productId" INTEGER REFERENCES products(id) UNIQUE,
      "keywordId" INTEGER REFERENCES keywords(id) UNIQUE
    );
`);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialCustomers() {
  try {
    console.log("Starting to create customers...");
    await createCustomer({
      username: 'picasso',
      firstName: 'Pablo',
      lastName: 'Picasso',
      email: 'immortal_artist@gmail.com',
      password: 'yaboippeternal',
      address: '123 Chateau of Vauvenargues',
      postal: 12345,
      city: 'Madrid',
      phone: '1234567890',
      isActive: false,
      isAdmin: false,
    });
    await createCustomer({
      username: 'jvstinj',
      firstName: 'Justin',
      lastName: 'Johnson',
      email: 'jvstin7@gwu.edu',
      password: 'admin12345',
      isActive: true,
      isAdmin: true,
    });
    console.log("Finished creating customers!");
  } catch (error) {
    console.error("Error creating customers!")
  }
}

async function createInitialProducts() {
  try {
    console.log("Starting to create products...");
    await createProduct({
      isActive: true,
      name: 'Weeping Woman',
      artist: 'Pablo Picasso',
      description: 'Weeping Woman is based on an image of a woman holding her dead child. It is taken from Picasso’s anti-war mural, Guernica. Picasso painted both works during the Spanish Civil War (1936-39). It was in response to the bombing of the Basque town of Guernica. The attack was carried out in April 1937 by Nazi Germany’s air force, in support of Spain\'s Nationalist forces. Hundreds of people were killed. The figure of the Weeping Woman is based on artist and photographer Dora Maar. Maar photographed Picasso\'s making of Guernica.',
      img: 'https://www.pablopicasso.org/images/paintings/the-weeping-woman.jpg',
      price: '$1937.00',
      featured: true,
      stock: 5,
    });
    await createProduct({
      isActive: true,
      name: 'Young Acrobat on a Ball',
      artist: 'Pablo Picasso',
      description: 'The year 1905 saw the final collapse of the blue pallet in I Picasso\'s work, as greys and then warm reds were gradually allowed to seep back into the range during the year. His repertoire of thin, gaunt female figures is joined by a troupe of other circus personalities. Fun and optimism, instead of melancholia and social alienation, return as subject matter, though depictions of entertainment are still moderated by the inherent social out-casting of the circus community.',
      img: 'https://www.pablopicasso.org/images/paintings/young-acrobat-on-a-ball.jpg',
      price: '$1905.00',
      featured: true,
      stock: 5,
    });

    console.log("Finished creating products!");
  } catch (error) {
    console.error("Error creating products!");
  }
}

async function createInitialReviews() {
  try {
    console.log("Starting to create reviews...");
    const customer = await getCustomerById(2);
    await createReview({
      reviewId: 2,
      username: customer.username,
      rating: 5, 
      description: 'What balance! Both in terms of color and depth, as well as the girl!', 
    });
    console.log("Finished creating reviews!");
  } catch (error) {
    console.error("Error creating reviews!");
  }
}

async function createInitialCategories() {
  try {
    console.log("Starting to create categories...");
    await createCategory({
      categoryId: 2, 
      categoryName: 'Abstract Impressionism', 
      description: 'Often referred to as “Action Painting”, expressionism is a highly dynamic kind of art that involves the spontaneous application of sweeping brushstrokes and the effects of dripping and spilling paint onto the canvas.'
    });
    console.log("Finished creating categories!");
  } catch (error) {
    console.error("Error creating categories!");
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialCustomers();
    await createInitialProducts();
    await createInitialReviews();
    await createInitialCategories();
  } catch (error) {
    console.log('Error during rebuildDB')
    throw error;
  }
}

module.exports = {
  rebuildDB
};
