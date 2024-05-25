const router = require("express").Router();
const {
  createFriend,
  deleteFriend,
} = require("../../controllers/appController");

// /api/applications
router.route("/").get(getFriends).post(createFriend);

module.exports = router;
