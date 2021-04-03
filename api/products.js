const express = require("express");
const productsRouter = express.Router();
const { createProduct, updateProduct, deleteProduct } = require("../db");

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
    keywords = ""
  } = req.body;

  const keywordArr = keywords.trim().split(/\s+/);
  const productData = {};

  if (keywordArr.length) {
    productData.keywords = keywordArr;
  }

  try {

    productData.isActive = isActive;
    productData.name = name;
    productData.artist = artist;
    productData.description = description;
    productData.img = img;
    productData.price = price;
    productData.featured = featured;
    productData.stock = stock;

    const product = await createProduct(productData);
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
  const {
    isActive,
    name,
    artist,
    description,
    img,
    price,
    featured,
    stock,
    keywords = ""
  } = req.body;

  const updatedProductData = {};

  if (keywords && keywords.length > 0) {
    updatedProductData.keywords = keywords.trim().split(/\s+/);
  }

  if (isActive) {
    updatedProductData.isActive = isActive;
  }

  if (name) {
    updatedProductData.name = name;
  }

  if (artist) {
    updatedProductData.artist = artist;
  }

  if (description) {
    updatedProductData.description = description;
  }

  if (img) {
    updatedProductData.img = img;
  }

  if (price) {
    updatedProductData.price = price;
  }

  if (featured) {
    updatedProductData.featured = featured;
  }

  if (stock) {
    updatedProductData.stock = stock;
  }

  try {
    const updatedProduct = await updateProduct(productId, updatedProductData);
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
