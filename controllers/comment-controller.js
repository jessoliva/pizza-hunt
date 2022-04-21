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

   // With new replies, we aren't actually creating a reply document; we're just updating an existing comment
   addReply({ params, body }, res) {
      Comment.findOneAndUpdate(
         { _id: params.commentId },
         { $push: { replies: body } }, // $push allows for duplicates, $addToSet doesn't
         { new: true, runValidators: true }
      )
      .then(dbPizzaData => {
         if (!dbPizzaData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
         }
         // mongoose will return the updated comment
         res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
   },
   // As we did with addComment() and removeComment(), we're passing params here as a parameter, so we'll need to make sure we pass it to addReply() when we implement it later in the route

   // remove reply
   removeReply({ params }, res) {
      Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
      )
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.json(err));
   },
   // Here, we're using the MongoDB $pull operator to remove the specific reply from the replies array where the replyId matches the value of params.replyId passed in from the route.

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