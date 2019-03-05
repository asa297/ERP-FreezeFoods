const isAuthenticated = require("../middlewares/Authenticated");

module.exports = (app, client) => {
  app.post("/api/itemcate", isAuthenticated, async (req, res) => {
    const { name } = req.user;
    const text =
      "INSERT INTO item_category(name, create_by, create_time, last_modify_by, last_modify_time) VALUES($1, $2, $3, $4, $5) RETURNING id, name";
    const values = [req.body.name, name, new Date(), name, new Date()];

    client.query(text, values, (err, value) => {
      if (err) {
        console.log(err.stack);
        res.status(400).send();
      } else {
        res.send({ result: value.rows[0] });
      }
    });
  });

  app.get("/api/itemcategory", isAuthenticated, async (req, res) => {
    const data = await client.query("SELECT id , name from item_category");
    res.send(data.rows);
  });

  app.delete("/api/itemcategory/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    if (!id) res.status(400).send("need id of item category");
    await client.query(`DELETE from item_category Where id = ${id}`);

    const data = await client.query("SELECT id , name from item_category");
    res.send(data.rows);
  });
};
