const client = require("./client");

async function createOrder({
  orderId,
  productId,
  quantity,
  subtotal
}) {
  try {
    const { rows: [order] } = await client.query(`
      INSERT INTO orders ("orderId", "productId", quantity, subtotal)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [orderId, productId, quantity, subtotal]);
    return order;
  } catch (error) {
    throw error;
  }
}

async function updateOrder(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString === 0) {
    return;
  }

  try {
    const {
      rows: [ order ],
    } = await client.query(
      `
      UPDATE orders
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return order;
  } catch (error) {
    throw error;
  }
}

async function deleteOrder(id){
  try{
    await client.query(`
      DELETE FROM reviews
      WHERE "orderId"=$1
    `, [id]);
  } catch (error){
    throw (error)
  }
}

async function getOrdersByCustomer(customerId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM orders
      WHERE "orderId"=${customerId};
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllOrders() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM orders;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createOrder,
  updateOrder, 
  deleteOrder,
  getAllOrders,
  getOrdersByCustomer
};