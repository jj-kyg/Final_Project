
const dummyDatabase = {
    itemId: 1,
    isActive: true,
    name: "First Item",
    description: "This is a description",
    cost: 10.99,
    featured: false,
    onHand: 20,
    keywords: ["car", "engine"],
    category: "televisions",
    photos: ["http://placekitten.com/200/287", "http://placekitten.com/200/299", "http://placekitten.com/200/300"],
    reviews: ["reviewId"]
    
}

const dummyUserDataBase = [{
    userId: 1,
    isActive: true,
    username: "JohnSmith99",
    name: "John Smith",
    email: "a@a.com",
    password: "123123",
    previousOrders: [],
    currentOrder: {
        uniqueOrderId: "1",
        items: [[1, 5],[2, 4],[3, 3],[4, 2],[5, 1]]
        },
    reviews: [
                {itemId: "1", reviewId: 1, date: "10/17/2020", rating: "5", text: "This was great!"},
                {itemId: "2", reviewId: 2, date: "10/20/2020", rating: "2", text: "This was terrible."}]}
    ,{

    userId: 2,
    isActive: true,
    username: "AnnaJoe",
    name: "Anna Joe",
    email: "b@b.com",
    password: "22222222",
    previousOrders: [],
    currentOrder: {
        uniqueOrderId: "2",
        items: [[2, 1],[3, 2],[4, 1],[5, 22], [1, 55]]
    },
    reviews: [
                {itemId: "3", reviewId: 4, date: "11/11/2020", rating: "3", text: "This was meh!"},
                {itemId: "4", reviewId: 3, date: "12/01/2020", rating: "2", text: "This was okay."}]}
    ,{

    userId: 3,
    isActive: true,
    username: "BillyBob11",
    name: "Billy Bob",
    email: "c@c.com",
    password: "3333333",
    previousOrders: [{uniqueOrderId: 3, [[2, 1],[1, 3]]}],
    currentOrder: {
        uniqueOrderId: "4",
        items: [[1, 2],[4, 3]]
    },
    reviews: [
                {itemId: "3", reviewId: 4, date: "11/11/2020", rating: "3", text: "This was meh!"},
                {itemId: "4", reviewId: 3, date: "12/01/2020", rating: "2", text: "This was okay."}]}]




console.log (dummyDatabase)

console.log (dummyUserDataBase)