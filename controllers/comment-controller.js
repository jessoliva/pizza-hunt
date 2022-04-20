const { Comment, Pizza } = require('../models');

const commentController = {

   // add comment to pizza
   // need to know which pizza to add the comment to
   addComment({ params, body }, res) {

      console.log(body);

      Comment.create(body)
      .then(({ _id }) => {
         console.log(_id)

         return Pizza.findOneAndUpdate(
            { _id: params.pizzaId },
            { $push: { comments: _id } }, 
            // $push is a mongoose operator that adds the comment to the pizza's comments array
            // we're using the $push method to add the comment's _id to the specific pizza we want to update
            // $push method works just the same way that it works in JavaScript—it adds data to an array
            // comments in pizza model is an array
            { new: true }
         );
      })
      .then(dbPizzaData => {

         if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
         }

         res.json(dbPizzaData);
         // We're also returning the pizza Promise here so that we can do something with the results of the Mongoose operation
         // Again, because we passed the option of new: true, we're receiving back the updated pizza (the pizza with the new comment included).
      })
      .catch(err => res.json(err));  
   },

   // remove comment
   removeComment({ params }, res) {

      // The first method used here, .findOneAndDelete(), works a lot like .findOneAndUpdate(), as it deletes the document while also returning its data
      // find the comment with the specific _id and delete it
      Comment.findOneAndDelete({ _id: params.commentId }) 
      .then(deletedComment => {
         if (!deletedComment) {
            return res.status(404).json({ message: 'No comment with this id!' });
         }

         // We then take that data and use it to identify and remove it from the associated pizza using the Mongo $pull operation
         // find the pizza with the specific _id and remove the comment from its comments array
         return Pizza.findOneAndUpdate(
            { _id: params.pizzaId },
            { $pull: { comments: params.commentId } },
            { new: true }
         );
      })
      .then(dbPizzaData => {
         if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
         }

         //  Lastly, we return the updated pizza data, now without the _id of the comment in the comments array
         res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
   }
};

module.exports = commentController;