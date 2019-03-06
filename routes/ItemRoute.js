const isAuthenticated = require("../middlewares/Authenticated");

module.exports = (app, client) => {
  app.post("/api/item", isAuthenticated, async (req, res) => {
    const { name: UserName } = req.user;
    const { name, category, remark } = req.body;
    const text =
      "INSERT INTO item(name, item_category_id, item_category_name ,remark, create_by, create_time, last_modify_by, last_modify_time) VALUES($1, $2, $3, $4, $5,$6, $7 , $8)";
    const values = [
      name,
      category.id,
      category.name,
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
        res.send();
      }
    });
  });

  app.get("/api/item", isAuthenticated, async (req, res) => {
    const data = await client.query(
      "SELECT id, name, item_category_id, item_category_name ,remark from item"
    );
    res.send(data.rows);
  });

  app.get("/api/item/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    const data = await client.query(
      `SELECT id, name, item_category_id, item_category_name ,remark from item WHERE id = ${id}`
    );

    res.send({ result: data.rows[0] });
  });

  app.delete("/api/item/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    if (!id) res.status(400).send("need id of item category");
    await client.query(`DELETE from item Where id = ${id}`);

    const data = await client.query(
      "SELECT id, name, item_category_id, item_category_name ,remark from item"
    );
    res.send(data.rows);
  });
};
