const isAuthenticated = require("../middlewares/Authenticated");
const moment = require("moment");

module.exports = (app, client) => {
  app.post("/api/request", isAuthenticated, async (req, res) => {
    const { name: UserName } = req.user;
    const { document, lines } = req.body;

    const LastDocument = await client.query(
      `SELECT setval('request_id_seq',nextval('request_id_seq')-1) AS id;`
    );

    const text_document = `INSERT INTO request(code, date, contact_id , contact_org , remark , status , create_by, 
        create_time, last_modify_by, last_modify_time) 
        VALUES($1, $2, $3, $4, $5,$6, $7 , $8 ,$9 ,$10) RETURNING id `;

    const generateCode = `RFQ-${parseInt(LastDocument.rows[0].id) + 1}`;

    const values = [
      generateCode,
      moment(document.date)
        .utcOffset(7)
        .format("YYYY-MM-DDTHH:mm:ss.SSS"),
      document.contact.id,
      document.contact.org,
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
          line.unit_price || 0,
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

  app.get("/api/request/list/:page", isAuthenticated, async (req, res) => {
    const { page } = req.params;

    const data = await client.query(
      `SELECT * from request order by last_modify_time desc OFFSET ${(page -
        1) *
        30} ROWS FETCH NEXT 30 ROWS ONLY;`
    );

    const result = {
      data: data.rows,
      HasMore: data.rows.length === 30
    };

    res.send(result);
  });

  app.get(
    "/api/request/RequestReadyToUse/",
    isAuthenticated,
    async (req, res) => {
      const data = await client.query(
        `Select * from request where status = 1 order by id desc`
      );

      const result = {
        data: data.rows
      };

      res.send(result);
    }
  );

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

  app.delete("/api/request/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    if (!id) res.status(400).send("need id of item category");
    await client.query(`DELETE from request Where id = ${id}`);
    await client.query(`DELETE from request_line Where request_id = ${id}`);

    res.send();
  });

  app.put("/api/request/:id", isAuthenticated, async (req, res) => {
    let array_promise = [];
    const { id } = req.params;
    const { name: UserName } = req.user;

    const { document, lines, deleted_data } = req.body;

    const promise_doc_query = new Promise(async (resolve, reject) => {
      const text = `UPDATE request SET remark = $1, date = $2, contact_id = $3 , contact_org = $4,
        last_modify_by = $5, last_modify_time = $6 Where id = ${id}`;
      const values = [
        document.remark,
        moment(document.date)
          .utcOffset(7)
          .format("YYYY-MM-DDTHH:mm:ss.SSS"),
        document.contact.id,
        document.contact.org,
        UserName,
        new Date()
      ];

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

  app.get("/api/request/rfq/:code", isAuthenticated, async (req, res) => {
    const { code } = req.params;

    const { rowCount, rows: document } = await client.query(
      `SELECT * from request WHERE code = '${code}' AND status = 1 limit 1`
    );
    if (rowCount !== 1 || document.length == 0) res.send();
    else {
      const { id } = document[0];
      const { rows: lines } = await client.query(
        `SELECT * from request_line WHERE request_id = ${id}`
      );
      const data = {
        document: document[0],
        lines: lines
      };

      res.send(data);
    }
  });
};
