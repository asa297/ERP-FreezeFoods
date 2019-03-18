const isAuthenticated = require("../middlewares/Authenticated");

module.exports = (app, client) => {
  app.post("/api/contact", isAuthenticated, async (req, res) => {
    const { name: UserName } = req.user;
    const { name, phone, org, remark, address } = req.body;
    const text = `INSERT INTO contact(name, phone, org, remark, create_by, 
        create_time, last_modify_by, last_modify_time, address) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`;
    const values = [
      name,
      phone,
      org,
      remark,
      UserName,
      new Date(),
      UserName,
      new Date(),
      address
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

  app.get("/api/contact/list/:page", isAuthenticated, async (req, res) => {
    const { page } = req.params;

    const data = await client.query(
      `SELECT id, name, phone, org, remark, address from contact order by last_modify_time desc OFFSET ${(page -
        1) *
        30} ROWS FETCH NEXT 30 ROWS ONLY;`
    );

    const result = {
      data: data.rows,
      HasMore: data.rows.length === 30
    };

    res.send(result);
  });

  app.get("/api/contact/list", isAuthenticated, async (req, res) => {
    const data = await client.query(
      `SELECT id , name, phone, org, remark, address from contact order by id`
    );

    const result = {
      data: data.rows,
      HasMore: false
    };
    res.send(result);
  });

  app.get("/api/contact/form/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    const data = await client.query(
      `SELECT id, name, phone, org, remark, address from contact WHERE id = ${id}`
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
    const { name, phone, org, remark, address } = req.body;
    const text = `UPDATE contact SET name = $1, phone = $2, org = $3, 
    remark = $4, last_modify_by = $5, last_modify_time = $6, address = $7 Where id = ${id}`;
    const values = [name, phone, org, remark, UserName, new Date(), address];

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
