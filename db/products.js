const client = require("./client");
const { getReviewsByProduct } = require("./reviews");
const { getCategoriesByProduct } = require("./categories");

async function createProduct({
  isActive,
  name,
  artist,
  description,
  img,
  price,
  featured,
  stock,
}) {
  try {
    const { rows: [product] } = await client.query(`
      INSERT INTO products ("isActive", name, artist, description, img, price, featured, stock)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `, [isActive, name, artist, description, img, price, featured, stock]);
    return product;
  } catch (error) {
    throw error;
  }
}

async function updateProduct(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString === 0) {
    return;
  }

  try {
    const {
      rows: [product],
    } = await client.query(
      `
      UPDATE products
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return product;
  } catch (error) {
    throw error;
  }
}

async function getAllProducts() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM products;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getProductById(productId) {
  try {
    const {
      rows: [product],
    } = await client.query(`
      SELECT * FROM products
      WHERE id=${productId};
    `);

    if (!product) {
      return;
    } else {
      const reviews = await getReviewsByProduct(productId);
      const categories = await getCategoriesByProduct(productId);
      product.reviews = reviews;
      product.categories = categories;
      return product;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  updateProduct,
  createProduct
};
