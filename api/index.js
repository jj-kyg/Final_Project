// api router
const express = require('express');
const apiRouter = express.Router();
const {getCustomerById, getAllProducts} = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer '
  const auth = req.header('Authorization');

  if (!auth) {
    next(); // don't set req.user, no token was passed in
  } else if (auth.startsWith(prefix)) {
    // recover the token
    const token = auth.slice(prefix.length);
    try {
      // recover the data
      const { id } = jwt.verify(token, JWT_SECRET);
      
      if (id) {
          req.user = await getCustomerById(id);
          next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
      next({
          name: 'AuthorizationHeaderError',
          message: `Authorization token must start with ${ prefix }`
      });
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("Customer is set:", req.user);
  }
  next();
});

const health_checkRouter = require('./health_check');
apiRouter.use('/health', health_checkRouter);

const customersRouter = require('./customers');
apiRouter.use('/customers', customersRouter);

const productsRouter = require('./products');
apiRouter.use('/products', productsRouter);

const reviewsRouter = require('./reviews');
apiRouter.use('/reviews', reviewsRouter);

const keywordsRouter = require('./keywords');
apiRouter.use('/keywords', keywordsRouter);

apiRouter.use('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    throw(error)
  }
})

apiRouter.use((error, req, res, next) => {
  res.status(500);
  res.send(error);
});

// export the api router
module.exports = apiRouter;