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
const { Client } = require("pg");

//require
require("dotenv").config();
require("./models/UserModel");
require("./models/LogModel");

mongoose.connect(`${process.env.DB}`);
const client = new Client({
  connectionString: process.env.DB_SQL,
  ssl: true
});

client.connect();

require("./schedule/noti")(client);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

nextApp
  .prepare()
  .then(() => {
    require("./routes/GeneralRoute")(app);
    require("./routes/AuthRoute")(app);
    require("./routes/ItemCategoryRoute")(app, client);
    require("./routes/ItemUnitRoute")(app, client);
    require("./routes/ContactRoute")(app, client);
    require("./routes/ItemRoute")(app, client);
    require("./routes/RequestRoute")(app, client);
    require("./routes/PORoute")(app, client);
    require("./routes/RSRoute")(app, client);
    require("./routes/DNRoute")(app, client);
    require("./routes/RNRoute")(app, client);
    require("./routes/ReportRoute")(app, client);

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
