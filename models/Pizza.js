// import Schema constructor and model function
const { Schema, model } = require('mongoose');

const dateFormat = require('../utils/dateFormat');

// create the schema for the model to create a new pizza
// We essentially create a schema, using the Schema constructor we imported from Mongoose, and define the fields with specific data types.
// We don't have to define the fields, as MongoDB will allow the data anyway, but for for clarity and usability, we should regulate what the data will look like.
const PizzaSchema = new Schema(
   {
      pizzaName: {
         type: String
      },
      createdBy: {
         type: String
      },
      createdAt: {
         type: Date,
         default: Date.now,
         //  we set a default value to the JavaScript Date.now function. If no value is provided in this field when the user creates new data, the Date.now function will be executed and will provide a timestamp. This way we don't have to create the timestamp elsewhere and send that data.
         get: (createdAtVal) => dateFormat(createdAtVal)
         // uses the function dateFormat from the dateFormat.js file to format the date
         // With this get option in place, every time we retrieve a pizza, the value in the createdAt field will be formatted by the dateFormat() function and used instead of the default timestamp value. 
         // This way, we can use the timestamp value for storage, but use a prettier version of it for display.
      },
      size: {
         type: String,
         default: 'Large'
      },
      toppings: [],
      // associate the pizza and comments models
      comments: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
         }
      ]
      // The ref property is especially important because it tells the Pizza model which documents to search to find the right comments   
   },
   { // this tells the schema that i can use virtuals
      toJSON: {
        virtuals: true,
        getters: true
      },
      id: false
      // We set id to false because this is a virtual that Mongoose returns, and we don’t need it
   }
);
// See how we don't have to use special imported data types for the type definitions? Using MongoDB and Mongoose, we simply instruct the schema that this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers, and so on.
// Notice the empty brackets [] in the toppings field. This indicates an array as the data type. You could also specify Array in place of the brackets.

// use a virtual
// a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents
// Virtual properties work just like regular functions
// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
   return this.comments.length;
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;

// this file connects to models/index.js
