const client = require('./client');
const {getProductById} = require('./products');

async function createKeywords(keywordList) {
  if (keywordList.length === 0) {
    return;
  }

  const insertValues = keywordList.map(
    (_, index) => `$${index + 1}`).join('), (');

  const selectValues = keywordList.map(
    (_, index) => `$${index + 1}`).join(', ');

  try {
    await client.query(`
      INSERT INTO keywords(name)
      VALUES (${insertValues})
      ON CONFLICT (name) DO NOTHING;
    `, keywordList);

    const { rows } = await client.query(`
      SELECT * FROM keywords
      WHERE name
      IN (${selectValues});
    `, keywordList);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function createProductKeyword(productId, keywordId) {
  try {
    await client.query(`
      INSERT INTO product_keywords("productId", "keywordId")
      VALUES ($1, $2)
      ON CONFLICT ("productId", "keywordId") DO NOTHING;
    `,[productId, keywordId]);
  } catch (error) {
    throw error;
  }
}

async function addKeywordsToProduct(productId, keywordList) {
  try {
    const createProductKeywordPromise = keywordList.map(
      keyword => createProductKeyword(productId, keyword.id)
    );

    await Promise.all(createProductKeywordPromise);

    return await getProductById(productId);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createKeywords,
  createProductKeyword,
  addKeywordsToProduct
}