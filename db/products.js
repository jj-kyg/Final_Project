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
  keywords = []
}) {
  try {
    const { rows: [product] } = await client.query(`
      INSERT INTO products ("isActive", name, artist, description, img, price, featured, stock)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `, [isActive, name, artist, description, img, price, featured, stock]);

    const keywordsList = await createKeywords(keywords);

    return await addKeywordsToProduct(product.id, keywordsList);
  } catch (error) {
    throw error;
  }
}

async function updateProduct(id, fields = {}) {
  const { keywords } = fields;
  delete fields.keywords;

  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    if (setString.length > 0) {
      await client.query(`
        UPDATE products
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
        Object.values(fields));
    }

    if (keywords === undefined) {
      return await getProductById(id);
    }

    const keywordList = await createKeywords(keywords);
    const keywordListIdString = keywordList.map(
      keyword => `${ keyword.id }`
    ).join(', '); 

    await client.query(`
      DELETE FROM product_keywords
      WHERE "keywordId"
      NOT IN (${ keywordListIdString })
      AND "productId"=$1;
    `, [id]);

    await addKeywordsToProduct(id, keywordList);

    return await getProductById(id);
  } catch (error) {
    throw error;
  }  
}

async function getProductsByKeyword(keyword) {
  try {
    const { rows: productIds } = await client.query(`
      SELECT products.id
      FROM products
      JOIN product_keywords ON products.id=product_keywords."productId"
      JOIN keywords ON keywords.id=product_keywords."keywordId"
      WHERE keywords.name=$1
    `, [keyword]);

    return await Promise.all(productIds.map(
      product => getProductById(product.id)
    ));
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

async function createKeywords(keywordList) {
  if (keywordList.length === 0) {
    return [];
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

async function getAllKeywords() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM keywords;
    `)
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
    const product = await getProductById(productId);
    return product;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  updateProduct,
  createProduct,
  deleteProduct,
  addKeywordsToProduct,
  createProductKeyword,
  createKeywords,
  getProductsByKeyword,
  getAllKeywords
};
