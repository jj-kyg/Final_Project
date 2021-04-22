const express = require("express");
const shoppingCartRouter = express.Router();
const { getOrdersByCustomer, updateOrder, deleteOrderBySerialNo } = require('../db');

shoppingCartRouter.get('/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const orders = await getOrdersByCustomer(customerId);
    res.send(orders);
  } catch (error) {
    throw(error)
  }
});

shoppingCartRouter.patch("/:orderId", async (req, res, next) => {
  const { orderId } = req.params;
  console.log(req.body)
  try {
    const updatedOrder = await updateOrder(orderId, req.body);
    res.send(updatedOrder);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

shoppingCartRouter.delete('/:serialno', async(req, res, next) => {
  const { serialno } = req.params; 
  try {
    const deletedOrder = await deleteOrderBySerialNo(serialno);
    res.send(`${deletedOrder.serialno} has been deleted`);
  } catch (error) {
    next(error);
  }
});


module.exports = shoppingCartRouter;