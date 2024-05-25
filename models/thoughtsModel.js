const { Schema, model, Types } = require("mongoose");
const reaction = require("./reactionModel");

const thoughtsSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reaction],
  },

  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);
thoughtsSchema.virtual("reactionCount").get(function () {
  return `${this.reactions.length}`;
});

const Thought = model("thoughts", thoughtsSchema);

module.exports = Thought;
