const client = require('./client');
const { rebuildDB } = require('./seedData');
const { getAllCustomers, updateCustomer, getCustomerById } = require('./customers');
const { getAllProducts, getProductById, updateProduct, getProductsByKeyword } = require('./products');
const { getAllOrders, updateOrder, deleteOrder } = require('./orders');
const { createReview } = require('./reviews');

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

    console.log("Calling updateProduct on products[1], only updating keywords");
    const updateProductKeywordResult = await updateProduct(products[1].id, {
      keywords: ['oil', 'canvas']
    });
    console.log("updateProduct:", updateProductKeywordResult);

    console.log("Calling getProductsByKeyword with oil");
    const productsWithOil = await getProductsByKeyword('oil');
    console.log("Result:", productsWithOil);

    console.log("Calling getAllOrders");
    const orders = await getAllOrders();
    console.log("getAllOrders", orders);

    console.log("Calling updateOrder");
    const updatedOrder = await updateOrder(4, {quantity: 3});
    console.log("updateOrder", updatedOrder);

    console.log("Calling createRewiew");
    const review = await createReview({
      username: 'cstrick',
      reviewId: 1,
      rating: 4,
      description: "not bad..."
    })
    console.log("createReview", review);

    console.log("Calling getCustomerById");
    const customer = await getCustomerById(2);
    console.log("getCustomerById", customer);

    console.log("Calling deleteOrder");
    const deletedOrder = await deleteOrder(2);
    console.log("deleteOrder", deletedOrder);
    console.log("Finished database tests!");
  } catch (error) {
    throw error;
  }
}

rebuildDB()
  .then(testdB)
  .catch(console.error)
  .finally(() => client.end());