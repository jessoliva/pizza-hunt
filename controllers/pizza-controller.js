const { Pizza } = require('../models');
// const { Pizza } = require('../models'); DOESNT WORK

// will hold the five main CRUD methods for the /api/pizzas endpoint routes
const pizzaController = {

   // the functions will go in here as methods

   // GET /api/pizzas
   // get all pizzas
   getAllPizza(req, res) {
      Pizza.find({})
      .populate({ // populate the comments array with the comments that are associated with each pizza
         path: 'comments',
         select: '-__v'
         // Note that we also used the select option inside of populate(), so that we can tell Mongoose that we don't care about the __v field on comments either. The minus sign - in front of the field indicates that we don't want it to be returned. If we didn't have it, it would mean that it would return only the __v field
      })
      .select('-__v') // added to query to exclude the __v field from the response
      .sort({ _id: -1 }) // sort the results in descending order by _id (newest first)
      // This gets the newest pizza because a timestamp value is hidden somewhere inside the MongoDB ObjectId
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
   getPizzaById({ params }, res) { // destructuring params object { params} from body of request (req)

      // doesnt need sort method added to query bc returning only 1 pizza
      Pizza.findOne({ _id: params.id })
      .populate({
         path: 'comments',
         select: '-__v'
      })
      .select('-__v') 
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
      // With Mongoose, the "where" clause is used first, then the updated data, then options for how the data should be returned
      // to prevent user from updating the pizza and adding whatever they want, include runValidators: true in the options
      Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true }) 
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
         // or can write res.json(true);
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
