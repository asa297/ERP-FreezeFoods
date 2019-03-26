var mongoose = require("mongoose");

var LogSchema = new mongoose.Schema({
  ItemId: Number,
  ItemName: String,
  DocCode: String,
  DocDate: Date,
  QTY: Number,
  UnitId: Number,
  UnitName: String,
  ExpireDate: Date,
  Remark: String,
  CreateTime: Date
});
mongoose.model("Log", LogSchema);
