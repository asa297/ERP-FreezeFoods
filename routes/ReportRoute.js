const isAuthenticated = require("../middlewares/Authenticated");
const moment = require("moment");

module.exports = (app, client) => {
  app.post("/api/report/ExpireItem", isAuthenticated, async (req, res) => {
    let { start_date, end_date } = req.body;
    start_date = moment(start_date).format("YYYY-MM-DD");
    end_date = moment(end_date)
      .add(1, "d")
      .format("YYYY-MM-DD");

    const { rows: result } = await client.query(
      `
      SELECT 
        rs.code AS rs_code,
        rs.date AS rs_date,
        rs_line.item_id AS item_id ,
        rs_line.item_name AS item_name,
        rs_line.remain_qty AS remain_qty,
        rs_line.unit_name AS unit_name,
        rs_line.expire_date AS expire_date,
        rs_line.remark AS remark
      FROM rs_line join rs on rs_line.rs_id = rs.id
      WHERE rs_line.expire_date between '${start_date}' and '${end_date}'
      
      `
    );

    res.send(result);
  });
};
