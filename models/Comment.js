const dateFormat = require('../utils/dateFormat');
const { Schema, model, Types } = require('mongoose');
// Here we'll need a unique identifier instead of the default _id field that is created, so we'll add a custom replyId field in ReplySchema. Despite the custom field name, we're still going to have it generate the same type of ObjectId() value that the _id field typically does, but we'll have to import that type of data first.

// instead of creating a Reply model, we'll create replies as a subdocument array for the comments
const ReplySchema = new Schema(
    {
        // set custom id to avoid confusion with parent comment _id
        // able to do this because we imported the Types module from mongoose
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String,
            required: true,
            trim: true
      
        },
        writtenBy: {
            type: String,
            required: true
      
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    { 
        toJSON: {
          getters: true
        }
    }
);

const CommentSchema = new Schema(
    {
        writtenBy: {
            type: String,
            required: true
      
        },
        commentBody: {
            type: String,
            required: true,
            trim: true
      
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        // to associate replies with comments
        replies: [ReplySchema]
        //  Update the CommentSchema to have the replies field populated with an array of data that adheres to the ReplySchema definition
        // Note that unlike our relationship between pizza and comment data, replies will be nested directly in a comment's document and not referred to.
    },
    { 
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// virtual for CommentSchema to get the total reply count
// get total count of replies on a comment
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;