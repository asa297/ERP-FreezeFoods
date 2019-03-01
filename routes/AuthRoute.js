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
      role: userInDB.Role,
      type: AUTH_USER_TYPE
    };
    res.cookie("token", userData, COOKIE_OPTIONS);
    res.json(userData);
  });

  app.post("/api/logout", (req, res) => {
    console.log("logout na");
    res.clearCookie("token", COOKIE_OPTIONS);
    res.sendStatus(204);
  });

  app.get("/api/checkRole/:id", async (req, res) => {
    const { id } = req.params;

    const userInDB = await User.findById(id, { Role: 1 });
    if (!userInDB) res.status(404).send("Roke is invalid");
    res.send({ UserRole: userInDB.Role });
  });
};
