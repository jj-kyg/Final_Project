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
    const { rows: productIds } = await client.query(`
      SELECT id FROM products;
    `);

    const products = await Promise.all(productIds.map(
      product => getProductById(product.id)
    ))
    return products;
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

    const {rows: keywords } = await client.query(`
      SELECT keywords.* 
      FROM keywords
      JOIN product_keywords ON keywords.id=product_keywords."keywordId"
      WHERE product_keywords."productId"=$1;
    `, [productId])

    if (!product) {
      return;
    } else {
      const reviews = await getReviewsByProduct(productId);
      const categories = await getCategoriesByProduct(productId);
      product.reviews = reviews;
      product.categories = categories;
      product.keywords = keywords;
      return product;
    }
  } catch (error) {
    throw error;
  }
}

async function deleteProduct(id){
  try{
    const { rows: product } = await client.query(`
      DELETE FROM products
      WHERE id=$1
      RETURNING *;
    `, [id]);
    await client.query(`
      DELETE FROM reviews
      WHERE "reviewId"=$1
    `, [id]);
    return product;
  } catch (error){
    throw (error)
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  updateProduct,
  createProduct,
  deleteProduct
};
