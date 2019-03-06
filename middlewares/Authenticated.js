const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  // return UserModel.findOne({ email: email }, function(err, user) {
  //   if (err) return res.status(500).send("Error on the server.");
  //   if (!user)
  //     return cb(null, false, { message: "Incorrect email or password." });

  //   var passwordIsValid = bcrypt.compareSync(password, user.password);
  //   if (!passwordIsValid)
  //     return cb(null, false, { message: "Incorrect email or password." });

  //   cb(null, user, { message: "Logged In Successfully" });
  // });
  const auth = req.signedCookies;

  if (!auth) {
    res.status(401).send("User is not valid");
  } else {
    req.user = auth.token;
    next();
    // console.log(auth);
  }
};
