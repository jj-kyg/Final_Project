const client = require("./client");

async function createOrder({
  orderId,
  productId,
  status,
  quantity
}) {
  try {
    const { rows: [order] } = await client.query(`
      INSERT INTO orders ("orderId", "productId", status, quantity)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [orderId, productId, status, quantity]);
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
      console.log(order)
    return order;
  } catch (error) {
    throw error;
  }
}

async function deleteOrder(id){
  try{
    const { rows: [ deletedOrder ] } = await client.query(`
      DELETE FROM orders
      WHERE "orderId"=$1
      RETURNING *;
    `, [id]);
    console.log(deletedOrder);
    return deletedOrder; 
  } catch (error){
    throw (error)
  }
}

async function getOrdersByCustomer(customerId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM orders
      JOIN products ON orders."productId"=products.id AND orders."orderId"=${customerId};
    `);

    rows.forEach((order) => {
      delete order.description;
      delete order.featured;
      delete order.img;
      delete order.artist;
    })
   
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