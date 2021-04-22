const client = require("./client");

async function createCategory({categoryId, categoryName, description}) {
  try {
    const { rows: [ category ] } = await client.query(`
      INSERT INTO categories ("categoryId", "categoryName", description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [categoryId, categoryName, description]);
    return category;
  } catch (error) {
    throw error;
  }
}

async function updateCategory(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString === 0) {
    return;
  }

  try {
    const {
      rows: [ category ],
    } = await client.query(
      `
      UPDATE categories
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return category;
  } catch (error) {
    throw error;
  }
}

async function getAllCategories() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM categories;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getCategoriesByProduct(productId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM categories
      WHERE "categoryId"=${productId};
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoriesByProduct
}