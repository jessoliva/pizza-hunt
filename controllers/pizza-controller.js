const { Pizza } = require('../models');
// const { Pizza } = require('../models'); DOESNT WORK

// will hold the five main CRUD methods for the /api/pizzas endpoint routes
const pizzaController = {

   // the functions will go in here as methods

   // GET /api/pizzas
   // get all pizzas
   getAllPizza(req, res) {
      Pizza.find({})
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
         console.log(err);
         res.status(400).json(err);
      });
   },
   // The first method, getAllPizza(), will serve as the callback function for the GET /api/pizzas route
   // It uses the Mongoose .find() method, much like the Sequelize .findAll() method

   // GET /api/pizzas/:id
   // get one pizza by id
   getPizzaById({ params }, res) {
      Pizza.findOne({ _id: params.id })
      .then(dbPizzaData => {
         // If no pizza is found, send 404
         // If we can't find a pizza with that _id, we can check whether the returning value is empty and send a 404 status back to alert users that it doesn't exist
         if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
         }
         res.json(dbPizzaData);
      })
      .catch(err => {
         console.log(err);
         res.status(400).json(err);
      });
   },
   // The second method, .getPizzaById(), uses the Mongoose .findOne() method to find a single pizza by its _id
   // Instead of accessing the entire req, we've destructured params out of it, because that's the only data we need for this request to be fulfilled

   // POST /api/pizzas
   // create a new pizza
   createPizza({ body }, res) {
      Pizza.create(body)
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.status(400).json(err));
   },
   // With this .createPizza() method, we destructure the body out of the Express.js req object because we don't need to interface with any of the other data it provides

   // PUT /api/pizzas/:id
   // update a pizza by id
   updatePizza({ params, body }, res) {
      Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbPizzaData => {
         if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
         }
         res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
   },
   // With this .findOneAndUpdate() method, Mongoose finds a single document we want to update, then updates it and returns the updated document
   // If we don't set that third parameter, { new: true }, it will return the original document
   // By setting the parameter to true, we're instructing Mongoose to return the new version of the document
   // There are also Mongoose and MongoDB methods called .updateOne() and .updateMany(), which update documents without returning them

   // DELETE /api/pizzas/:id
   // delete pizza
   deletePizza({ params }, res) {
      Pizza.findOneAndDelete({ _id: params.id })
      .then(dbPizzaData => {
         if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
         }
         res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
   }
   // we use the Mongoose .findOneAndDelete() method, which will find the document to be returned and also delete it from the database --> it returns the pizza's data as confirmation message
   //  Like with updating, we could alternatively use .deleteOne() or .deleteMany(), but we're using the .findOneAndDelete() method because it provides a little more data in case the client wants it
};

module.exports = pizzaController;

// Now that we've created the file and directory, let's work on the functionality. We'll create all of these functions as methods of the pizzaController object
// Because these methods will be used as the callback functions for the Express.js routes, each will take two parameters: req and res

// this file connects to pizza-routes.js
