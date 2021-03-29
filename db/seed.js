const client = require('./client');
const { rebuildDB } = require('./seedData');
const { getAllCustomers, updateCustomer } = require('./customers');
const { getAllProducts, getProductById, updateProduct } = require('./products');

async function testdB() {
  try {
    console.log("Starting to test database...");
    const customers = await getAllCustomers();
    console.log("getAllCustomers:", customers);

    console.log("Calling updateCustomer on customers[1]")
    const updateCustomerResult = await updateCustomer(customers[1].id, { username: "Administrator" });
    console.log("Result:", updateCustomerResult);

    console.log("Calling getAllProducts");
    const products = await getAllProducts();
    console.log("getAllProducts:", products);

    console.log("Calling updateProduct on product[0]");
    const updatedProduct = await updateProduct(products[0].id, {
      price: '1937.99',
      stock: 4
    });
    console.log("updateProduct:", updatedProduct);

    console.log("Calling getProductById");
    const product = await getProductById(2);
    console.log("getProductById", product);
    console.log("Finished database tests!");
  } catch (error) {
    throw error;
  }
}

rebuildDB()
  .then(testdB)
  .catch(console.error)
  .finally(() => client.end());