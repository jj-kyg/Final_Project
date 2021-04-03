const express = require("express");
const ordersRouter = express.Router();
const {getAllOrders, getOrdersByCustomer, deleteOrder} = require('../db');

ordersRouter.get('/', async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.send(orders);
  } catch (error) {
    throw(error)
  }
});

ordersRouter.get('/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const orders = await getOrdersByCustomer(customerId);
    res.send(orders);
  } catch (error) {
    throw(error)
  }
});

ordersRouter.patch("/:orderId", async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const updatedOrder = await updateOrder(orderId, req.body);
    res.send(updatedOrder);
  } catch (error) {
    next(error);
  }
});

ordersRouter.delete('/:orderId', async(req, res, next) => {
  const { orderId } = req.params 
  try {
    const deletedOrder = await deleteOrder(orderId);
    res.send(deletedOrder);
  } catch (error) {
    next(error);
  }
});


module.exports = ordersRouter;