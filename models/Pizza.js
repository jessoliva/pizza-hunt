// import Schema constructor and model function
const { Schema, model } = require('mongoose');

// create the schema for the model to create a new pizza
// We essentially create a schema, using the Schema constructor we imported from Mongoose, and define the fields with specific data types.
// We don't have to define the fields, as MongoDB will allow the data anyway, but for for clarity and usability, we should regulate what the data will look like.
const PizzaSchema = new Schema({
   pizzaName: {
      type: String
   },
   createdBy: {
      type: String
   },
   createdAt: {
      type: Date,
      default: Date.now
      //  we set a default value to the JavaScript Date.now function. If no value is provided in this field when the user creates new data, the Date.now function will be executed and will provide a timestamp. This way we don't have to create the timestamp elsewhere and send that data.
   },
   size: {
      type: String,
      default: 'Large'
   },
   toppings: []
});
// See how we don't have to use special imported data types for the type definitions? Using MongoDB and Mongoose, we simply instruct the schema that this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers, and so on.
// Notice the empty brackets [] in the toppings field. This indicates an array as the data type. You could also specify Array in place of the brackets.

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;

// this file connects to models/index.js
