const express = require("express");
const customersRouter = express.Router();
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;
const { createCustomer, getCustomerByUsername, getAllCustomers } = require("../db/customers");
const { requireAdmin} = require("./utils");

// Customers
customersRouter.post("/register", async (req, res, next) => {
  const {
    username,
    firstName,
    lastName,
    email,
    password,
    address,
    postal,
    city,
    phone,
    isActive,
    isAdmin,
  } = req.body;
  try {
    const _user = await getCustomerByUsername(username);

    if (_user) {
      res.status(401);
      return next({
        name: "CustomerExistsError",
        message: "A customer by that username already exists",
      });
    }

    if (password.length > 7) {
      const customer = await createCustomer({
        username,
        firstName,
        lastName,
        email,
        password,
        address,
        postal,
        city,
        phone,
        isActive,
        isAdmin,
      });
      console.log(customer, "line 23");
      const token = jwt.sign(
        {
          id: customer.id,
          username: customer.username,
        },
        JWT_SECRET
      );

      res.send({
        message: "thank you for signing up",
        token,
        customer: customer,
      });
    } else {
      res.status(401);
      return next({
        name: "PasswordError",
        message: "Password must be at least 8 characters",
      });
    }
  } catch (error) {
    next(error);
  }
});

customersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body, "line 52")

  if (!username || !password) {
      next({
          name: "MissingCredentialsError",
          message: "Please supply both a username and password"
      });
  }

  try {
      const customer = await getCustomerByUsername(username);

      if (customer) {
          const token = jwt.sign({
              id: customer.id,
              username: customer.username
          }, JWT_SECRET);
          
          res.send({ message: "you're logged in! ", token, customer })
      } else {
          res.status(401)
          next({
              name: 'IncorrectCredentialsError',
              message: 'Username or password is incorrect'
          });
          return;
      }
  } catch(error) {
      next(error);
  }
});

customersRouter.get("/manage_customers", requireAdmin, async (req, res, next) => {
  try {
    const customers = await getAllCustomers();
    res.send(customers);
  } catch (error) {
    throw(error);
  }
});

module.exports = customersRouter;
