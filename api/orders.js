const express = require("express");
const ordersRouter = express.Router();
const {getOrdersByCustomer, deleteOrder, createOrder} = require('../db');
const { requireCustomer } = require("./utils");

ordersRouter.post('/', async (req, res) => {
  const {
    orderId,
    productId,
    status,
    quantity
  } = req.body;
  try {
    const order = await createOrder({
      orderId,
      productId,
      status,
      quantity
    });
    res.send(order);
  } catch (error) {
    throw(error);
  }
});

ordersRouter.get('/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const orders = await getOrdersByCustomer(customerId);
    res.send(orders);
  } catch (error) {
    throw(error);
  }
});

ordersRouter.get('/order_summary/:customerId', requireCustomer, async(req, res, next) => {
  const { customerId } = req.params;
  try {
    const orderSummary = await getOrdersByCustomer(customerId);
    res.send(orderSummary);
  } catch (error) {
    throw(error);
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