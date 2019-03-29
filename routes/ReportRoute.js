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

  app.post("/api/report/FlowDailyItem", isAuthenticated, async (req, res) => {
    let { start_date, end_date } = req.body;
    start_date = moment(start_date).format("YYYY-MM-DD");
    end_date = moment(end_date)
      .add(1, "d")
      .format("YYYY-MM-DD");

    const { rows: result } = await client.query(
      `
        select sumtable.item_id, sumtable.item_name, 
          SUM(case when sumtable.source = 'RS' 
                then sumtable.sum_qty 
                else 0 
            end) AS inbound ,
          SUM(case when sumtable.source = 'DN' 
                then sumtable.sum_qty 
                else 0 
            end) AS outbound ,
          SUM(case when sumtable.source = 'RN' 
                then sumtable.sum_qty 
                else 0 
            end) AS return 
          from (
              select item_id , item_name, SUM(qty) AS SUM_QTY, 'RS' as source from rs_line where rs_line.create_time between '${start_date}' and '${end_date}' group by item_id, item_name 
                union all
              select item_id , item_name, SUM(qty) AS SUM_QTY, 'DN' as source from dn_line where dn_line.create_time between '${start_date}' and '${end_date}' group by item_id, item_name
                union all
              select item_id , item_name, SUM(qty) AS SUM_QTY, 'RN' as source from rn_line where rn_line.create_time between '${start_date}' and '${end_date}' group by item_id, item_name
          ) sumtable 
        left join item on item.id = sumtable.item_id
        group by sumtable.item_id , sumtable.item_name
    
      `
    );

    res.send(result);
  });
};
