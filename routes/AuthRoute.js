const axios = require("axios");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const dev = process.env.NODE_ENV !== "production";
const AUTH_USER_TYPE = "authenticated";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !dev,
  signed: true
};

// const authenticate = async (email, password) => {
//   const { data } = await axios.get(
//     "https://jsonplaceholder.typicode.com/users"
//   );
//   return data.find(user => {
//     if (user.email === email && user.website === password) {
//       return user;
//     }
//   });
// };

module.exports = app => {
  app.post("/api/test", async (req, res) => {
    const hashedPassword = bcrypt.hashSync("admin", 8);

    await User({
      Name: "Rattanapol",
      Username: "god",
      Password: hashedPassword,
      Role: 1,
      RecordDate: new Date()
    }).save();

    // const token = jwt.sign({ id: user._id }, config.secret, {
    //   expiresIn: 86400 // expires in 24 hours
    // });

    res.send();
  });

  app.post("/api/login", async (req, res) => {
    const { Username, Password } = req.body;
    const userInDB = await User.findOne({ Username });

    if (!userInDB) return res.status(403).send("Invalid email or password");

    const passwordIsValid = bcrypt.compareSync(Password, userInDB.Password);
    if (!passwordIsValid)
      return res.status(403).send("Invalid email or password");

    const userData = {
      _id: userInDB._id,
      name: userInDB.Name,
      username: userInDB.Username,
      type: AUTH_USER_TYPE
    };
    res.cookie("token", userData, COOKIE_OPTIONS);
    res.json(userData);
  });

  app.post("/api/logout", (req, res) => {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.sendStatus(204);
  });

  // app.get("/api/profile", async (req, res) => {
  //   const { signedCookies = {} } = req;
  //   const { token } = signedCookies;
  //   if (token && token.email) {
  //     const { data } = await axios.get(
  //       "https://jsonplaceholder.typicode.com/users"
  //     );
  //     const userProfile = data.find(user => user.email === token.email);
  //     return res.json({ user: userProfile });
  //   }
  //   res.sendStatus(404);
  // });

  // app.get("/api/checkRole", async (req, res) => {
  //   const { _id } = req.params;
  //   const userInDB = await User.findById(_id, { Role: 1 });

  //   if (userInDB) {
  //     console.log(userInDB);
  //     res.send();
  //   }

  //   res.status(404);
  // });
};
