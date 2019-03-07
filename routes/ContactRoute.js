const isAuthenticated = require("../middlewares/Authenticated");

module.exports = (app, client) => {
  app.post("/api/contact", isAuthenticated, async (req, res) => {
    const { name: UserName } = req.user;
    const { name, phone, org, remark } = req.body;
    const text =
      "INSERT INTO contact(name, phone, org, remark, create_by, create_time, last_modify_by, last_modify_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id";
    const values = [
      name,
      phone,
      org,
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

  app.get("/api/contact", isAuthenticated, async (req, res) => {
    const data = await client.query(
      "SELECT id, name, phone, org, remark from contact order by id"
    );
    res.send(data.rows);
  });

  app.get("/api/contact/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    const data = await client.query(
      `SELECT id, name, phone, org, remark from contact WHERE id = ${id}`
    );

    res.send({ result: data.rows[0] });
  });

  app.delete("/api/contact/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    if (!id) res.status(400).send("need id of item category");
    await client.query(`DELETE from contact Where id = ${id}`);

    res.send();
  });

  app.put("/api/contact/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { name: UserName } = req.user;
    const { name, phone, org, remark } = req.body;
    const text = `UPDATE contact SET name = $1, phone = $2, org = $3, remark = $4, last_modify_by = $5, last_modify_time = $6 Where id = ${id}`;
    const values = [name, phone, org, remark, UserName, new Date()];

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
