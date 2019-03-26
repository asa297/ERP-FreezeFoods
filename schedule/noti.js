const schedule = require("node-schedule");
const mongoose = require("mongoose");
const Log = mongoose.model("Log");
const moment = require("moment");

module.exports = client => {
  schedule.scheduleJob("0 0 * * *", async () => {
    const start_date = moment().format("YYYY-MM-DD");
    const end_date = moment()
      .add(5, "d")
      .format("YYYY-MM-DD");

    const { rows: result } = await client.query(
      `
    SELECT
      rs.code AS rs_code,
      rs.date AS rs_date,
      rs_line.item_id AS item_id ,
      rs_line.item_name AS item_name,
      rs_line.remain_qty AS remain_qty,
      rs_line.unit_id AS unit_id,
      rs_line.unit_name AS unit_name,
      rs_line.expire_date AS expire_date,
      rs_line.remark AS remark
    FROM rs_line join rs on rs_line.rs_id = rs.id
    WHERE rs_line.expire_date between '${start_date}' and '${end_date}'
    `
    );

    result.map(line => {
      Log({
        ItemId: line.item_id,
        ItemName: line.item_name,
        DocCode: line.rs_code,
        DocDate: line.rs_date,
        QTY: line.remain_qty,
        UnitId: line.unit_id,
        UnitName: line.unit_name,
        ExpireDate: line.expire_date,
        Remark: line.remark || "",
        CreateTime: moment()
      }).save();
    });

    console.log("run");
  });
};
