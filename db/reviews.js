const client = require("./client");

async function createReview({username, reviewId, rating, description}) {
  try {
    const { rows: [review] } = await client.query(`
      INSERT INTO reviews (username, "reviewId", rating, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [username, reviewId, rating, description ]);
    
    return review;
  } catch (error) {
    throw error;
  }
}

async function updateReview(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString === 0) {
    return;
  }

  try {
    const {
      rows: [ review ],
    } = await client.query(
      `
      UPDATE reviews
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return review;
  } catch (error) {
    throw error;
  }
}

async function getAllReviews() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM reviews;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getReviewsByProduct(productId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM reviews
      WHERE "reviewId"=${productId};
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function deleteReview(id){
  try{
    await client.query(`
      DELETE FROM reviews
      WHERE "reviewId"=$1
    `, [id]);
  } catch (error){
    throw (error)
  }
}

module.exports = {
  createReview,
  updateReview,
  getAllReviews,
  getReviewsByProduct,
  deleteReview
}