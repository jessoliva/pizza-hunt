const router = require('express').Router();
const {
    addComment,
    removeComment,
    addReply,
    removeReply
} = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// /api/comments/<pizzaId>/<commentId>
// need to parameters to delete a comment because after deleting a particular comment,  you need to know exactly which pizza that comment originated from.
router
    .route('/:pizzaId/:commentId')
    .put(addReply)
    .delete(removeComment)
// Remember that the callback function of a route method has req and res as parameters, so we don't have to explicitly pass any arguments to addReply
// This is a PUT route, instead of a POST, because technically we're not creating a new reply resource. Instead, we're just updating the existing comment resource. This is also reflected in the endpoint, because we make no reference to a reply resource.

// create a DELETE route to handle removeReply. You'll need to create a new route for this one, because you'll need the id of the individual reply, not just its parent.
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);
// Again, we're trying to model the routes in a RESTful manner, so as a best practice we should include the ids of the parent resources in the endpoint. It's kind of like saying, "Go to this pizza, then look at this particular comment, then delete this one reply."

module.exports = router;