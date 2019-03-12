const isAuthenticated = require("../middlewares/Authenticated");

module.exports = (app, client) => {
  app.post("/api/request", isAuthenticated, async (req, res) => {
    const { name: UserName } = req.user;
    const { document, lines } = req.body;

    const LastDocument = await client.query(
      `SELECT id from request order by id desc LIMIT 1`
    );

    const text_document = `INSERT INTO request(code, date, remark , status , create_by, 
        create_time, last_modify_by, last_modify_time) 
        VALUES($1, $2, $3, $4, $5,$6, $7 , $8) RETURNING id `;

    const generateCode = `RFQ-${
      LastDocument.rows.length !== 0 ? LastDocument.rows[0].id + 1 : 1
    }`;
    const values = [
      generateCode,
      document.date,
      document.remark,
      1, //Save
      UserName,
      new Date(),
      UserName,
      new Date()
    ];

    const request_doc = await client.query(text_document, values);

    const promise_lines_query = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text_lines = `INSERT INTO request_line(request_id, item_id, item_name , qty , remain_qty
          ,unit_id ,unit_name, unit_price , remark
          ,create_by, create_time, last_modify_by, last_modify_time) 
          VALUES($1, $2, $3, $4, $5,$6, $7 , $8 ,$9 , $10, $11, $12, $13)`;
        const values = [
          request_doc.rows[0].id,
          line.item_id,
          line.item_name,
          line.qty,
          line.qty,
          line.unit_id,
          line.unit_name,
          line.unit_price,
          line.remark,
          UserName,
          new Date(),
          UserName,
          new Date()
        ];

        await client.query(text_lines, values);

        resolve();
      });
    });

    await Promise.all(promise_lines_query);

    res.send({ id: request_doc.rows[0].id });
  });

  // app.get("/api/item/list/:page", isAuthenticated, async (req, res) => {
  //   const { page } = req.params;

  //   const data = await client.query(
  //     `SELECT id, name, item_category_id, item_category_name ,remark from item order by id OFFSET ${(page -
  //       1) *
  //       30} ROWS FETCH NEXT 30 ROWS ONLY;`
  //   );

  //   const result = {
  //     data: data.rows,
  //     HasMore: data.rows.length === 30
  //   };
  //   res.send(result);
  // });

  // app.get("/api/item/list", isAuthenticated, async (req, res) => {
  //   const data = await client.query(
  //     `SELECT id, name, item_category_id, item_category_name ,remark from item order by id`
  //   );

  //   const result = {
  //     data: data.rows,
  //     HasMore: false
  //   };
  //   res.send(result);
  // });

  app.get("/api/request/form/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    const doc = new Promise(async (resolve, reject) => {
      const result = await client.query(
        `SELECT * from request WHERE id = ${id}`
      );
      resolve(result);
    });

    const lines = new Promise(async (resolve, reject) => {
      const result = await client.query(
        `SELECT * from request_line WHERE request_id = ${id}`
      );
      resolve(result);
    });

    const result = await Promise.all([doc, lines]);

    const data = {
      document: result[0].rows[0],
      lines: result[1].rows
    };
    res.send(data);
  });

  // app.delete("/api/item/:id", isAuthenticated, async (req, res) => {
  //   const { id } = req.params;

  //   if (!id) res.status(400).send("need id of item category");
  //   await client.query(`DELETE from item Where id = ${id}`);

  //   res.send();
  // });

  // app.put("/api/item/:id", isAuthenticated, async (req, res) => {
  //   const { id } = req.params;
  //   const { name: UserName } = req.user;
  //   const { name, category, remark } = req.body;
  //   const text = `UPDATE item SET name = $1, item_category_id = $2, item_category_name = $3 ,remark = $4, last_modify_by = $5, last_modify_time = $6 Where id = ${id}`;
  //   const values = [
  //     name,
  //     category.id,
  //     category.name,
  //     remark,
  //     UserName,
  //     new Date()
  //   ];

  //   client.query(text, values, (err, value) => {
  //     if (err) {
  //       console.log(err.stack);
  //       res.status(400).send();
  //     } else {
  //       res.send();
  //     }
  //   });
  // });
};
