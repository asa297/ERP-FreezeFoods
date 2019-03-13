const isAuthenticated = require("../middlewares/Authenticated");

module.exports = (app, client) => {
  app.post("/api/po", isAuthenticated, async (req, res) => {
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
          ,create_by, create_time, last_modify_by, last_modify_time, uuid) 
          VALUES($1, $2, $3, $4, $5,$6, $7 , $8 ,$9 , $10, $11, $12, $13, $14)`;
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
          new Date(),
          line.uuid
        ];

        await client.query(text_lines, values);

        resolve();
      });
    });

    await Promise.all(promise_lines_query);

    res.send({ id: request_doc.rows[0].id });
  });

  app.get("/api/po/list/:page", isAuthenticated, async (req, res) => {
    const { page } = req.params;

    const data = await client.query(
      `SELECT * from request order by id OFFSET ${(page - 1) *
        30} ROWS FETCH NEXT 30 ROWS ONLY;`
    );

    const result = {
      data: data.rows,
      HasMore: data.rows.length === 30
    };

    res.send(result);
  });

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

  app.get("/api/po/form/:id", isAuthenticated, async (req, res) => {
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

  app.delete("/api/po/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    if (!id) res.status(400).send("need id of item category");
    await client.query(`DELETE from request Where id = ${id}`);
    await client.query(`DELETE from request_line Where request_id = ${id}`);

    res.send();
  });

  app.put("/api/po/:id", isAuthenticated, async (req, res) => {
    let array_promise = [];
    const { id } = req.params;
    const { name: UserName } = req.user;

    const { document, lines, deleted_data } = req.body;

    const promise_doc_query = new Promise(async (resolve, reject) => {
      const text = `UPDATE request SET remark = $1, last_modify_by = $2, last_modify_time = $3 Where id = ${id}`;
      const values = [document.remark, UserName, new Date()];

      await client.query(text, values);
      resolve();
    });

    array_promise.push(promise_doc_query);

    const old_lines = lines.filter(line => line.id !== 0);
    const promise_lines_updatequery = old_lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE request_line SET item_id = $1, item_name = $2,
        qty = $3, unit_id = $4, unit_name = $5 ,  unit_price =$6 , remark = $7
        ,last_modify_by = $8,
        last_modify_time = $9 Where id = ${line.id} RETURNING id`;
        const values = [
          line.item_id,
          line.item_name,
          line.qty,
          line.unit_id,
          line.unit_name,
          line.unit_price,
          line.remark,
          UserName,
          new Date()
        ];

        await client.query(text, values);

        resolve();
      });
    });

    array_promise.push(promise_lines_updatequery);

    const new_lines = lines.filter(line => line.id === 0);
    const promise_lines_query = new_lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text_lines = `INSERT INTO request_line(request_id, item_id, item_name , qty , remain_qty
          ,unit_id ,unit_name, unit_price , remark
          ,create_by, create_time, last_modify_by, last_modify_time, uuid)
          VALUES($1, $2, $3, $4, $5,$6, $7 , $8 ,$9 , $10, $11, $12, $13, $14)`;
        const values = [
          id,
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
          new Date(),
          line.uuid
        ];

        await client.query(text_lines, values);

        resolve();
      });
    });

    array_promise.push(promise_lines_query);

    const promise_lines_deletequery = deleted_data.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `DELETE FROM request_line Where id = ${line.id}`;

        await client.query(text);

        resolve();
      });
    });

    array_promise.push(promise_lines_deletequery);

    await Promise.all(array_promise);

    res.send();
  });
};
