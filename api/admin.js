const express = require("express");
const adminRouter = express.Router();
const {getAllOrders, getOrdersByCustomer, deleteOrder, updateOrder, getAllCustomers, getAllKeywords} = require('../db');
const { requireAdmin } = require("./utils");

adminRouter.get('/', requireAdmin, async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.send(orders);
  } catch (error) {
    console.error(error);
    throw(error);
  }
});

adminRouter.get('/:customerId', requireAdmin, async (req, res) => {
  const { customerId } = req.params;
  try {
    const orders = await getOrdersByCustomer(customerId);
    res.send(orders);
  } catch (error) {
    throw(error);
  }
});

adminRouter.get('/order_summary/:customerId', requireAdmin, async(req, res, next) => {
  const { customerId } = req.params;
  try {
    const orderSummary = await getOrdersByCustomer(customerId);
    res.send(orderSummary);
  } catch (error) {
    throw(error);
  }
});

adminRouter.patch("/:orderId", requireAdmin, async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const updatedOrder = await updateOrder(orderId, req.body);
    res.send(updatedOrder);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

adminRouter.delete('/:orderId', requireAdmin, async(req, res, next) => {
  const { orderId } = req.params 
  try {
    const deletedOrder = await deleteOrder(orderId);
    deletedOrder.deleted = 'deleted';
    res.send(deletedOrder);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = adminRouter;