const client = require("./client");
const bcrypt = require("bcrypt");

const saltRounds = 10;

async function createCustomer({
  username,
  firstName,
  lastName,
  email,
  password,
  address,
  postal,
  city,
  phone,
  isActive,
  isAdmin,
}) {
  try {
    const hash = bcrypt.hashSync(password, saltRounds);
    const {
      rows: [customer],
    } = await client.query(
      `
      INSERT INTO customers(username, "firstName", "lastName", email, password, address, postal, city, phone, "isActive", "isAdmin") 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *;
    `,
      [
        username,
        firstName,
        lastName,
        email,
        hash,
        address,
        postal,
        city,
        phone,
        isActive,
        isAdmin,
      ]
    );

    delete customer.password;
    console.log(customer)
    return customer;
    
  } catch (error) {
    throw error;
  }
}

async function getCustomerById(id) {
  try {
    const { rows: [ customer ] } = await client.query(`
      SELECT * FROM customers
      WHERE id=${ id };
    `);

    delete customer.password;
    return customer;
  } catch (error) {
    throw error;
  }
}

async function getCustomerByUsername(username) {
  try {
    const { rows: [ customer] } = await client.query(`
      SELECT * FROM customers
      WHERE username='${ username }';
    `);
      return customer;
  } catch (error) {
      throw error;
  }
}

module.exports = {
  createCustomer,
  getCustomerById,
  getCustomerByUsername
}