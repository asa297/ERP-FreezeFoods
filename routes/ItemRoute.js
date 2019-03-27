const isAuthenticated = require("../middlewares/Authenticated");

module.exports = (app, client) => {
  app.post("/api/item", isAuthenticated, async (req, res) => {
    const { name: UserName } = req.user;
    const { name, category, unit, expire_date, remark } = req.body;
    const text = `INSERT INTO item(name, item_category_id, item_category_name  ,item_unit_id
        , item_unit_name , expire_date ,remark, create_by, create_time, last_modify_by, last_modify_time) 
        VALUES($1, $2, $3, $4, $5,$6, $7 , $8, $9, $10, $11) RETURNING id`;
    const values = [
      name,
      category.id,
      category.name,
      unit.id,
      unit.name,
      expire_date,
      remark,
      UserName,
      new Date(),
      UserName,
      new Date()
    ];

    client.query(text, values, (err, value) => {
      if (err) {
        console.log(err.stack);
        res.status(400).send();
      } else {
        res.send({ id: value.rows[0].id });
      }
    });
  });

  app.get("/api/item/list/:page", isAuthenticated, async (req, res) => {
    const { page } = req.params;

    const data = await client.query(
      `SELECT id, name, item_category_id, item_category_name , item_unit_id
        ,item_unit_name ,qty ,remark from item order by last_modify_time desc OFFSET ${(page -
          1) *
          30} ROWS FETCH NEXT 30 ROWS ONLY;`
    );

    const result = {
      data: data.rows,
      HasMore: data.rows.length === 30
    };
    res.send(result);
  });

  app.get("/api/item/list", isAuthenticated, async (req, res) => {
    const data = await client.query(
      `SELECT id, name, item_category_id, item_category_name ,item_unit_id
      , item_unit_name,remark from item order by id`
    );

    const result = {
      data: data.rows,
      HasMore: false
    };
    res.send(result);
  });

  app.get("/api/item/form/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    const data = await client.query(
      `SELECT id, name, item_category_id, item_category_name ,item_unit_id
      , item_unit_name, expire_date ,remark from item WHERE id = ${id}`
    );

    res.send({ result: data.rows[0] });
  });

  app.delete("/api/item/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    if (!id) res.status(400).send("need id of item category");
    await client.query(`DELETE from item Where id = ${id}`);

    res.send();
  });

  app.put("/api/item/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { name: UserName } = req.user;
    const { name, category, unit, expire_date, remark } = req.body;
    const text = `UPDATE item SET name = $1, item_category_id = $2, item_category_name = $3 , 
    item_unit_id = $4, item_unit_name = $5, expire_date = $6
    ,remark = $7, last_modify_by = $8, last_modify_time = $9 Where id = ${id}`;
    const values = [
      name,
      category.id,
      category.name,
      unit.id,
      unit.name,
      expire_date,
      remark,
      UserName,
      new Date()
    ];

    client.query(text, values, (err, value) => {
      if (err) {
        console.log(err.stack);
        res.status(400).send();
      } else {
        res.send();
      }
    });
  });
};
