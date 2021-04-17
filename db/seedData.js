// require in the database adapter functions
const client = require("./client");
const { createCustomer, getCustomerById } = require("./customers");
const { createProduct } = require("./products");
const { createReview } = require("./reviews");
const { createCategory } = require("./categories");
const { createOrder } = require("./orders");

async function dropTables() {
  console.log("Dropping All Tables...");
  // drop all tables, in the correct order
  try {
    await client.query(`
      DROP TABLE IF EXISTS product_keywords;
      DROP TABLE IF EXISTS keywords;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS submitted_orders;
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
      "isActive" BOOLEAN DEFAULT 'true',
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

    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      "orderId" INTEGER REFERENCES customers(id) NOT NULL,
      "productId" INTEGER REFERENCES products(id),
      status VARCHAR(255) NOT NULL,
      quantity INTEGER,
      serialno INTEGER UNIQUE NOT NULL
    );

    CREATE TABLE submitted_orders (
      id SERIAL PRIMARY KEY,
      "orderId" INTEGER REFERENCES customers(id) NOT NULL,
      username VARCHAR(255) REFERENCES customers(username),
      email VARCHAR(255) REFERENCES customers(email),
      "productId" INTEGER REFERENCES products(id),
      status VARCHAR(255) NOT NULL,
      quantity INTEGER,
      serialNo INTEGER UNIQUE NOT NULL
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
      "productId" INTEGER REFERENCES products(id),
      "keywordId" INTEGER REFERENCES keywords(id),
      UNIQUE ("productId", "keywordId")
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
      username: "picasso",
      firstName: "Pablo",
      lastName: "Picasso",
      email: "immortal_artist@gmail.com",
      password: "yaboippeternal",
      address: "123 Chateau of Vauvenargues",
      postal: 12345,
      city: "Madrid",
      phone: "1234567890",
      isActive: false,
      isAdmin: false,
    });
    await createCustomer({
      username: "jvstinj",
      firstName: "Justin",
      lastName: "Johnson",
      email: "jvstin7@gwu.edu",
      password: "admin12345",
      isActive: true,
      isAdmin: true,
    });
    console.log("Finished creating customers!");
  } catch (error) {
    console.error("Error creating customers!");
  }
}

async function createInitialProducts() {
  try {
    console.log("Starting to create products...");
    await createProduct({
      isActive: true,
      name: "Weeping Woman",
      artist: "Pablo Picasso",
      description:
        "Weeping Woman is based on an image of a woman holding her dead child. It is taken from Picasso's anti-war mural, Guernica. Picasso painted both works during the Spanish Civil War (1936-39). It was in response to the bombing of the Basque town of Guernica. The attack was carried out in April 1937 by Nazi Germany's air force, in support of Spain's Nationalist forces. Hundreds of people were killed. The figure of the Weeping Woman is based on artist and photographer Dora Maar. Maar photographed Picasso's making of Guernica.",
      img:
        "https://www.pablopicasso.org/images/paintings/the-weeping-woman.jpg",
      price: "$1937.00",
      featured: false,
      stock: 5,
    });
    await createProduct({
      isActive: true,
      name: "Young Acrobat on a Ball",
      artist: "Pablo Picasso",
      description:
        "The year 1905 saw the final collapse of the blue pallet in I Picasso's work, as greys and then warm reds were gradually allowed to seep back into the range during the year. His repertoire of thin, gaunt female figures is joined by a troupe of other circus personalities. Fun and optimism, instead of melancholia and social alienation, return as subject matter, though depictions of entertainment are still moderated by the inherent social out-casting of the circus community.",
      img:
        "https://www.pablopicasso.org/images/paintings/young-acrobat-on-a-ball.jpg",
      price: "$1905.00",
      featured: false,
      stock: 5,
    });
    await createProduct({
      isActive: true,
      name: "Two Heads On Gold",
      artist: "Jean Michel Basquiat",
      img:
        "https://d7hftxdivxxvm.cloudfront.net/?resize_to=width&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FmpXphO8ESt7rbhmUTUk3_Q%2Flarger.jpg&width=1200&quality=80",
      description:
        "Untitled (Two Heads on Gold), 1982, is a monumental diptych, more than ten feet wide. It is a double portrait of a skeletal, black man with staring eyes and bared teeth. Rage and fear power the composition, threatening to burst through the enforced stillness of the two figures and engulf the viewer.",
      price: "$1899.00",
      featured: false,
      stock: 7,
    });
    await createProduct({
      isActive: true,
      name: "Morning Sun",
      artist: "Edward Hopper",
      img: "https://i.redd.it/pgs666pq69e61.jpg",
      description:
        "Edward Hopper was one of the early American artists to paint the experience of human isolation in the modern city. In Morning Sun, the woman – modeled after Hopper’s wife, Jo – faces the sun impassively and seemingly lost in thought. Her visible right eye appears sightless, emphasizing her isolation. The bare wall and elevation of the room above the street also suggest the bleakness and solitude of impersonal urban life.",
      price: "$590.00",
      featured: true,
      stock: 11,
    });
    await createProduct({
      isActive: true,
      name: "Self Portrait",
      artist: "Jean Michel Basquiat",
      img: "https://i.redd.it/541w7b7zwpj61.jpg",
      description:
        "Basquiat was a charismatic, passionate artist, which is captured in the piercing gaze of this self-portrait. This is a portrait of a confident man, who know what he wanted to say to the world through his art. Painted with acrylic paint on an unframed canvas using a palette knife, the image uses texture to crackle with life.",
      price: "$870.00",
      featured: false,
      stock: 3,
    });
    await createProduct({
      isActive: true,
      name: "The Self-Seers II, Man and Death",
      artist: "Egon Schiele",
      img: "https://i.redd.it/lxqbdddp2vr01.jpg",
      description:
        "A great innovator of modern figure painting, Egon Schiele is known for creating erotic and deeply psychological portraits, on many occasions using himself as the subject. Schiele often used color sparingly, his work identifiable instead by his characteristic sinuous black line. In his many self-portraits, Schiele is typically nude and staring directly towards the viewer, making the works both revealing and confrontational. Schiele’s subjects, as in “The Self-Seers”,  are often portayed with their bodies in various contorted positions. Whether representing himself or others, Schiele’s pictures are strikingly raw and direct.",
      price: "$1299.00",
      featured: true,
      stock: 3,
    });
    await createProduct({
      isActive: true,
      name: "Native American in Flowers and Feathers",
      artist: "Alphonse Mucha",
      img: "https://i.redd.it/u8bzkhhony461.jpg",
      description:
        "Renowned for his posters, Czech artist Alfons Mucha became an international star when his posters featuring Sarah Bernhardt were released. His visual language is characteristic of art nouveau, interspersed with floral patterns and curved lines. His Native American in Flowers and Feathers saw Mucha branching out into the realist realm.",
      price: "$250.00",
      featured: false,
      stock: 5,
    });
    await createProduct({
      isActive: true,
      name: "Masks Watching Turtle",
      artist: "James Ensor",
      img: "https://i.redd.it/6glzux8uzzp41.jpg",
      description:
        "Subjects such as carnivals, masks, puppetry, skeletons, and fantastic allegories are dominant in Ensor’s mature work. Ensor dressed skeletons up in his studio and arranged them in colorful, enigmatic tableaux on the canvas, and used masks as a theatrical aspect in his still life paintings. Attracted by masks’ plastic forms, bright colors, and potential for psychological impact, he created a format in which he could paint with complete freedom. For Ensor, while the mask hides the identity of individuals it nevertheless exposes the wearer’s true personality – malicious, giddy, foolish. It is not, in this sense, a mask at all. “Masks” is one of the finest represenations of Ensor’s work.",
      price: "$1099.00",
      featured: true,
      stock: 5,
    });
    await createProduct({
      isActive: true,
      name: "The Intrigue",
      artist: "James Ensor",
      img: "https://i.redd.it/vi4pcl0lvls41.jpg",
      description:
        "The Intrigue is an oil on canvas painting created by Belgian expressionist painter James Ensor. This painting is in the possession of Royal Museum of Fine Arts Antwerp and is part of the official inventory of Flemish masterpieces. The use of masks in Ensor's paintings is prevalent.",
      price: "$1937.00",
      featured: true,
      stock: 5,
      keywords: ["yellows", "oil"],
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
      description:
        "What balance! Both in terms of color and depth, as well as the girl!",
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
      categoryName: "Abstract Impressionism",
      description:
        "Often referred to as “Action Painting”, expressionism is a highly dynamic kind of art that involves the spontaneous application of sweeping brushstrokes and the effects of dripping and spilling paint onto the canvas.",
    });
    console.log("Finished creating categories!");
  } catch (error) {
    console.error("Error creating categories!");
  }
}

async function createInitialOrders() {
  try {
    console.log("Starting to create orders...");
    await createOrder({
      orderId: 2,
      productId: 8,
      status: "created",
      quantity: 1,
    });
    await createOrder({
      orderId: 1,
      productId: 7,
      status: "processing",
      quantity: 2,
    });
    await createOrder({
      orderId: 1,
      productId: 4,
      status: "cancelled",
      quantity: 1,
    });
    await createOrder({
      orderId: 2,
      productId: 3,
      status: "completed",
      quantity: 1,
    });
  } catch (error) {
    console.error("Error creating orders!");
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
    await createInitialOrders();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

module.exports = {
  rebuildDB,
};
