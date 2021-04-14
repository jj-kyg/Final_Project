const express = require("express");
const keywordsRouter = express.Router();

const {getAllKeywords} = require('../db');
const { requireAdmin } = require("./utils");

keywordsRouter.get('/', requireAdmin, async (req, res, next) => {
  try {
    const keywords = await getAllKeywords();
    if (keywords) {
      res.send(keywords);
    } else {
      next({
        name: "Error",
        message: "Error getting keywords"
      })
    }
  } catch (error) {
    next(error)
  }
});

module.exports = keywordsRouter;