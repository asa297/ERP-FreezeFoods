const isAuthenticated = require("../middlewares/Authenticated");

module.exports = (app, client) => {
  app.post("/api/itemcategory", isAuthenticated, async (req, res) => {
    const { name: UserName } = req.user;
    const { name } = req.body;
    const text =
      "INSERT INTO item_category(name, create_by, create_time, last_modify_by, last_modify_time) VALUES($1, $2, $3, $4, $5) RETURNING id";
    const values = [name, UserName, new Date(), UserName, new Date()];

    client.query(text, values, (err, value) => {
      if (err) {
        console.log(err.stack);
        res.status(400).send();
      } else {
        res.send({ id: value.rows[0].id });
      }
    });
  });

  app.get("/api/itemcategory/list", isAuthenticated, async (req, res) => {
    const data = await client.query(
      `SELECT id , name from item_category order by id`
    );

    res.send(data.rows);
  });

  app.get("/api/itemcategory/list/:page", isAuthenticated, async (req, res) => {
    const { page } = req.params;

    // const data = await client.query(
    //   `SELECT id , name from item_category order by last_modify_time desc OFFSET ${(page -
    //     1) *
    //     30} ROWS FETCH NEXT 30 ROWS ONLY;`
    // );
    const data = await client.query(
      `SELECT id , name from item_category order by last_modify_time desc`
    );

    const result = {
      data: data.rows,
      HasMore: data.rows.length === 30
    };
    res.send(result);
  });

  app.get("/api/itemcategory/form/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    const data = await client.query(
      `SELECT id , name from item_category WHERE id = ${id}`
    );

    res.send({ result: data.rows[0] });
  });

  app.delete("/api/itemcategory/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    if (!id) res.status(400).send("need id of item category");
    await client.query(`DELETE from item_category Where id = ${id}`);

    res.send();
  });

  app.put("/api/itemcategory/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { name: UserName } = req.user;
    const { name } = req.body;
    const text = `UPDATE item_category SET name = $1, last_modify_by = $2, last_modify_time = $3 Where id = ${id}`;
    const values = [name, UserName, new Date()];

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
