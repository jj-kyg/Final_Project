const express = require("express");
const productsRouter = express.Router();
const { createProduct, getPRCById, getProductById, updateProduct, deleteProduct } = require("../db");

productsRouter.post("/", async (req, res, next) => {
  const {
    isActive,
    name,
    artist,
    description,
    img,
    price,
    featured,
    stock,
  } = req.body;
  try {
    const product = await createProduct({
      isActive,
      name,
      artist,
      description,
      img,
      price,
      featured,
      stock,
    });

    if (product) {
      res.send(product);
    } else {
      next({
        name: "Error",
        message: "Error creating product"
      })
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.patch("/:productId", async (req, res, next) => {
  const { productId } = req.params;
  const product = await getProductById(productId);
  console.log(productId, product)

  try {
    const updatedProduct = await updateProduct(productId, product);
    res.send(updatedProduct);
  } catch (error) {
    next(error);
  }
});

productsRouter.delete('/:productId', async(req, res, next) => {
  try {
    const { productId } = req.params 
    const deletedProduct = await deleteProduct(productId);
    res.send(deletedProduct);
  } catch (error) {
    next(error);
  }
});

module.exports = productsRouter;
