const isAuthenticated = require("../middlewares/Authenticated");

module.exports = (app, client) => {
  app.post("/api/po", isAuthenticated, async (req, res) => {
    const { name: UserName } = req.user;
    const { document, lines } = req.body;

    const LastDocument = await client.query(
      `SELECT setval('po_id_seq',nextval('po_id_seq')-1) AS id;`
    );

    //#region PO
    const text_document = `INSERT INTO po(code, date, remark , ref_doc_id, status , create_by,
        create_time, last_modify_by, last_modify_time)
        VALUES($1, $2, $3, $4, $5,$6, $7 , $8, $9) RETURNING id `;

    const generateCode = `PO-${parseInt(LastDocument.rows[0].id) + 1}`;
    const values = [
      generateCode,
      document.date,
      document.remark,
      document.refDocId,
      1, //Save
      UserName,
      new Date(),
      UserName,
      new Date()
    ];

    const po_doc = await client.query(text_document, values);

    const promise_lines_query = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text_lines = `INSERT INTO po_line (po_id, item_id, item_name , qty , remain_qty
          ,unit_id ,unit_name, unit_price , remark, ref_doc_id, ref_line_id
          ,create_by, create_time, last_modify_by, last_modify_time, uuid)
          VALUES($1, $2, $3, $4, $5,$6, $7 , $8 ,$9 , $10, $11, $12, $13, $14, $15, $16)`;
        const values = [
          po_doc.rows[0].id,
          line.item_id,
          line.item_name,
          line.qty,
          line.qty,
          line.unit_id,
          line.unit_name,
          line.unit_price,
          line.remark,
          line.request_id,
          line.id,
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

    //#endregion PO

    //#region RFQ

    const promise_docRFQ_update = new Promise(async (resolve, reject) => {
      const text = `UPDATE request SET status = 2 Where id = ${
        document.refDocId
      }`;
      await client.query(text);
      resolve();
    });

    const promise_linesRFQ_update = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE request_line SET remain_qty = remain_qty - ${
          line.qty
        } Where id = ${line.id} AND request_id = ${line.request_id}`;

        await client.query(text);

        resolve();
      });
    });

    //#endregion RFQ

    Promise.all([
      promise_lines_query,
      promise_docRFQ_update,
      promise_linesRFQ_update
    ])
      .then(() => {
        res.send({ id: po_doc.rows[0].id });
      })
      .catch(error => {
        res.send(error);
      });
  });

  app.get("/api/po/list/:page", isAuthenticated, async (req, res) => {
    const { page } = req.params;

    const data = await client.query(
      `SELECT po.*, request.code AS request_code from po left join request on po.ref_doc_id = request.id 
      order by po.id OFFSET ${(page - 1) * 30} ROWS FETCH NEXT 30 ROWS ONLY;`
    );

    const result = {
      data: data.rows,
      HasMore: data.rows.length === 30
    };

    res.send(result);
  });

  app.get("/api/po/form/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    const doc = new Promise(async (resolve, reject) => {
      const result = await client.query(
        `select po.* , request.code AS request_code, request.date AS request_date from po left join request on po.ref_doc_id = request.id  where po.id = ${id}`
      );

      resolve(result);
    });

    const lines = new Promise(async (resolve, reject) => {
      const result = await client.query(
        `SELECT po_line.* , request_line.qty AS request_qty from po_line left join request_line on po_line.ref_line_id =  request_line.id WHERE po_id = ${id}
        `
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
    const { name: UserName } = req.user;
    const { document, lines } = req.body;
    if (!id) res.status(400).send("need id of item category");

    const promise_docRFQ_updatequery = new Promise(async (resolve, reject) => {
      const text = `UPDATE request SET status = 1 Where id = ${
        document.ref_doc_id
      }`;

      await client.query(text);
      resolve();
    });

    const promise_linesRFQ_updatequery = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE request_line SET remain_qty = qty Where id = ${
          line.ref_line_id
        }`;
        await client.query(text);
        resolve();
      });
    });

    await Promise.all([
      promise_docRFQ_updatequery,
      promise_linesRFQ_updatequery
    ]);

    await client.query(`DELETE from po Where id = ${id}`);
    await client.query(`DELETE from po_line Where po_id = ${id}`);

    res.send();
  });

  app.put("/api/po/:id", isAuthenticated, async (req, res) => {
    let array_promise = [];
    const { id } = req.params;
    const { name: UserName } = req.user;

    const { document, lines } = req.body;

    const promise_doc_query = new Promise(async (resolve, reject) => {
      const text = `UPDATE po SET remark = $1, last_modify_by = $2, last_modify_time = $3 Where id = ${id}`;
      const values = [document.remark, UserName, new Date()];

      await client.query(text, values);
      resolve();
    });

    array_promise.push(promise_doc_query);

    const promise_lines_updatequery = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE po_line SET qty = $1, remain_qty = $2,  unit_price =$3 , remark = $4
        ,last_modify_by = $5, last_modify_time = $6 Where id = ${line.id}`;
        const values = [
          line.qty,
          line.qty,
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

    //คืน Remain Request_QTY

    const promise_linesRFQ_updatequery = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE request_line SET remain_qty = qty - ${
          line.qty
        } Where id = ${line.ref_line_id}`;

        await client.query(text);
        resolve();
      });
    });
    array_promise.push(promise_linesRFQ_updatequery);

    await Promise.all(array_promise);

    res.send();
  });
};
