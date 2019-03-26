const mongoose = require("mongoose");
const Log = mongoose.model("Log");
const moment = require("moment");
const isAuthenticated = require("../middlewares/Authenticated");

module.exports = app => {
  app.get("/api/getnoti", isAuthenticated, async (req, res) => {
    const noti = await Log.find({
      CreateTime: { $gte: moment().add(-7, "d") }
    }).sort({ CreateTime: -1 });
    res.send(noti);
  });
};
