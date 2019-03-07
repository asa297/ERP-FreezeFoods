const isAuthenticated = require("../middlewares/Authenticated");

module.exports = (app, client) => {
  app.post("/api/unit", isAuthenticated, async (req, res) => {
    const { name: UserName } = req.user;
    const { name, remark } = req.body;
    const text =
      "INSERT INTO item_unit(name, remark, create_by, create_time, last_modify_by, last_modify_time) VALUES($1, $2, $3, $4, $5,$6) RETURNING id";
    const values = [name, remark, UserName, new Date(), UserName, new Date()];

    client.query(text, values, (err, value) => {
      if (err) {
        console.log(err.stack);
        res.status(400).send();
      } else {
        res.send({ id: value.rows[0].id });
      }
    });
  });

  app.get("/api/unit", isAuthenticated, async (req, res) => {
    const data = await client.query(
      "SELECT id , name, remark from item_unit order by id"
    );
    res.send(data.rows);
  });

  app.get("/api/unit/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    const data = await client.query(
      `SELECT id , name from item_unit WHERE id = ${id}`
    );

    res.send({ result: data.rows[0] });
  });

  app.delete("/api/unit/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    if (!id) res.status(400).send("need id of item category");
    await client.query(`DELETE from item_unit Where id = ${id}`);

    res.send();
  });

  app.put("/api/unit/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { name: UserName } = req.user;
    const { name, remark } = req.body;
    const text = `UPDATE item_unit SET name = $1, remark = $2, last_modify_by = $3, last_modify_time = $4 Where id = ${id}`;
    const values = [name, remark, UserName, new Date()];

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
