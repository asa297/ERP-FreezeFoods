const axios = require("axios");
const dev = process.env.NODE_ENV !== "production";
const AUTH_USER_TYPE = "authenticated";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !dev,
  signed: true
};

const authenticate = async (email, password) => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return data.find(user => {
    if (user.email === email && user.website === password) {
      return user;
    }
  });
};

module.exports = app => {
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await authenticate(email, password);
    if (!user) {
      return res.status(403).send("Invalid email or password");
    }
    const userData = {
      name: user.name,
      email: user.email,
      type: AUTH_USER_TYPE
    };
    res.cookie("token", userData, COOKIE_OPTIONS);
    res.json(userData);
  });

  app.post("/api/logout", (req, res) => {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.sendStatus(204);
  });

  app.get("/api/profile", async (req, res) => {
    const { signedCookies = {} } = req;
    const { token } = signedCookies;
    if (token && token.email) {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const userProfile = data.find(user => user.email === token.email);
      return res.json({ user: userProfile });
    }
    res.sendStatus(404);
  });
};
