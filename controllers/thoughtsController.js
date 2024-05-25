const { Thought, User } = require("../models");

module.exports = {
  // Function to get all of the applications by invoking the find() method with no arguments.
  // Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Gets a single application using the findOneAndUpdate method. We pass in the ID of the application and then respond with it, or an error if not found
  async getSingleThought(req, res) {
    try {
      const thoughts = await Thought.findOne({
        _id: req.params.thoughtId,
      });

      if (!thoughts) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Creates a new application. Accepts a request body with the entire Application object.
  // Because applications are associated with Users, we then update the User who created the app and add the ID of the application to the applications array
  async createThought(req, res) {
    try {
      const thoughts = await Thought.create(req.body);
      const user = await Thought.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thoughts._id } },
        { new: true }
      );

      if (!thoughts) {
        return res.status(404).json({
          message: "Thought created, but found no user with that ID",
        });
      }

      res.json("Created the thought(s)🎉");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  //Updates and application using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
  async updateThought(req, res) {
    try {
      const thoughts = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thoughts) {
        return res
          .status(404)
          .json({ message: "No thoughts to update with this id!" });
      }

      res.json(thoughts);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Deletes an application from the database. Looks for an app by ID.
  // Then if the app exists, we look for any users associated with the app based on he app ID and update the applications array for the User.
  async deleteThought(req, res) {
    try {
      const thoughts = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });

      if (!thoughts) {
        return res.status(404).json({
          message: "No thoughts with this id!, so It cannot be deleted ",
        });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: "Thought created but no user with this id!",
        });
      }

      res.json({ message: "Thought successfully deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Adds a tag to an application. This method is unique in that we add the entire body of the tag rather than the ID with the mongodb $addToSet operator.
  async addReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!reaction) {
        return res.status(404).json({ message: "No reaction with this id!" });
      }

      res.json(reaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove application tag. This method finds the application based on ID. It then updates the tags array associated with the app in question by removing it's tagId from the tags array.
  async deleteReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!reaction) {
        return res.status(404).json({
          message: "No reaction with this id! so it can't be deleted",
        });
      }

      res.json(reaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
