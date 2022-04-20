const router = require('express').Router();

// import controllers --> methods for Pizza model
const {
    getAllPizza,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
} = require('../../controllers/pizza-controller');
// Instead of importing the entire object and having to do pizzaController.getAllPizza(), we can simply destructure the method names out of the imported object and use those names directly

// Set up GET all and POST at /api/pizzas
router
  .route('/') // the following routes will be prefixed with /api/pizzas
  .get(getAllPizza)
  .post(createPizza);
// See how we simply provide the name of the controller method as the callback? That's why we set up those methods to accept req and res as parameters!

// Set up GET one, PUT, and DELETE at /api/pizzas/:id
router
  .route('/:id') // the following routes will be prefixed with /api/pizzas/:id
  .get(getPizzaById)
  .put(updatePizza)
  .delete(deletePizza);

module.exports = router;
// once routes are set up, export them, and get them hooked into the entire server.js file

// Before we import the controller methods, let's dissect this new Express.js Router setup. Instead of creating duplicate routes for the individual HTTP methods, we can combine them! The following variations achieve the same goal:
// // this code
// router.route('/').get(getCallbackFunction).post(postCallbackFunction);

// // is this same as this
// router.get('/', getCallbackFunction);
// router.post('/' postCallbackFunction);

// Because we aren't actually writing the route functionality, this will keep the route files a lot cleaner and to the point. 
// the functionality is in the controllers folder with the object with the methods!!

// this file connects to api/index.js