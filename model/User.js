const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserScheme = new Schema({
  username: String,
  followedBy: Number,
  following: Number,
  fullName: String,
  isPrivate: Boolean,
  isError: Boolean,
  totalMediaCount: Number,
  lastTwelvePhotos: [
    {
      instaAiCaption: String,
      commentsDisabled: Boolean,
      likedBy: Number,
      mediaCaption: [
        {
          text: String,
        },
      ],
      commentCount: Number,
      takenAtTimestamp: Number,
    },
  ],
});

module.exports = mongoose.model("User", UserScheme);
