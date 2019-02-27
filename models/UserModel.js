var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  Name: String,
  Username: String,
  Password: String,
  Role: Number,
  RecordDate: Date
});
mongoose.model("User", UserSchema);
