const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;
const next = require("next");

// const bodyParser = require("body-parser");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const mongoose = require("mongoose");

//require

require("dotenv").config();
require("./models/UserModel");

mongoose.connect(`${process.env.DB}`);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

nextApp
  .prepare()
  .then(() => {
    require("./routes/AuthRoute")(app);
    require("./routes/ManageRoute")(app);

    app.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
