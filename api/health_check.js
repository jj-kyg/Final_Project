const express = require('express');
const health_checkRouter = express.Router();

health_checkRouter.get("/", (req, res) => {
  console.log("test");
    res.send({message: "All is well."});
});

module.exports = health_checkRouter;