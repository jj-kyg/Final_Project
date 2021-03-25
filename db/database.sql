CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  "firstName" VARCHAR(50) NOT NULL,
  "lastName" VARCHAR(50) DEFAULT '',
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  address VARCHAR(255) DEFAULT '',
  postal VARCHAR(255) DEFAULT '',
  city VARCHAR(255) DEFAULT '',
  phone VARCHAR(255) DEFAULT '',
  "isActive" BOOLEAN DEFAULT 'false',
  "isAdmin" Boolean DEFAULT 'false'
);

INSERT INTO customers (username, "firstName", "lastName", email, password, address, postal, city, phone, "isActive", "isAdmin")
VALUES ('JHarden13', 'James', 'Harden', 'jharden_isthebest@gmail.com', '12345678', '123 Brooklyn Palace', '12345', 'New York City', '123-456-7890', 'false', 'false')
RETURNING *;

CREATE TABLE category (
  id SERIAL PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  description VARCHAR(255)
);

INSERT INTO category (category, description)
VALUES ('expressionist', 'This is a description')
RETURNING *;

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  image VARCHAR(255) UNIQUE
);

INSERT INTO images (image)
VALUES ('https://images.app.goo.gl/pbjr7GaAnW2j7WMTA')
RETURNING *;

CREATE TABLE keywords (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);

INSERT INTO keywords (name)
VALUES ('pastel')
RETURNING *;

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) REFERENCES customers(username),
  rating INTEGER,
  description VARCHAR(255),
  date DATE
);

INSERT INTO reviews (username, description)
VALUES ('jvstinj', 'This is a great piece of art');

CREATE TABLE artwork (
  id SERIAL PRIMARY KEY,
  "isActive" Boolean,
  name VARCHAR(255) UNIQUE NOT NULL,
  description VARCHAR(255),
  price INTEGER NOT NULL,
  featured Boolean,
  stock INTEGER NOT NULL,
  keywords VARCHAR(255) REFERENCES keywords(name),
  "categoryId" INTEGER REFERENCES category(id),
  "imageId" INTEGER REFERENCES images(id),
  "reviewId" INTEGER REFERENCES reviews(id)
);

INSERT INTO artwork ("isActive", name, description, price, featured, stock, keywords, "categoryId", "imageId", "reviewId")
VALUES('true', 'picasso', 'beautiful disaster', '$50000', 'true', '1', 'oil, pastel', $8, $9, $10)
RETURNING *;

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
