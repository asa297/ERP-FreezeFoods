const isAuthenticated = require("../middlewares/Authenticated");
const moment = require("moment");
const { map, join, uniq, sumBy } = require("lodash");

module.exports = (app, client) => {
  app.post("/api/dn", isAuthenticated, async (req, res) => {
    const { name: UserName } = req.user;
    const { document, lines } = req.body;

    const LastDocument = await client.query(
      `SELECT setval('dn_id_seq',nextval('dn_id_seq')-1) AS id;`
    );

    const newId = parseInt(LastDocument.rows[0].id) + 1;

    //#region DN
    const promise_docDN_update = new Promise(async (resolve, reject) => {
      const amount = sumBy(lines, line => {
        return line.qty * line.unit_price;
      });
      const text_document = `INSERT INTO dn(code, date, remark , status , contact_address , contact_id , contact_org
        , amount , create_by, create_time, last_modify_by, last_modify_time)
        VALUES($1, $2, $3, $4, $5,$6, $7 , $8, $9 , $10 , $11, $12) RETURNING id `;

      const generateCode = `DN-${newId}`;

      const values = [
        generateCode,
        moment(document.date)
          .utcOffset(7)
          .format("YYYY-MM-DDTHH:mm:ss.SSS"),
        document.remark,
        1, //Save
        document.contact.address,
        document.contact.id,
        document.contact.org,
        amount,
        UserName,
        new Date(),
        UserName,
        new Date()
      ];

      await client.query(text_document, values);
      resolve();
    });

    const promise_linesDN_query = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text_lines = `INSERT INTO dn_line (dn_id, item_id, item_name , qty , remain_qty
          ,unit_id ,unit_name, unit_price, remark, ref_doc_id, ref_line_id
          ,create_by, create_time, last_modify_by, last_modify_time, uuid)
          VALUES($1, $2, $3, $4, $5,$6, $7 , $8 ,$9 , $10, $11, $12, $13, $14, $15, $16)`;
        const values = [
          newId,
          line.item_id,
          line.item_name,
          line.qty,
          line.qty,
          line.unit_id,
          line.unit_name,
          line.unit_price,
          line.remark,
          line.rs_id,
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

    //#endregion DN

    //#region RS

    const promise_docRS_update = new Promise(async (resolve, reject) => {
      const groupRSDocId = join(uniq(map(lines, "rs_id")));
      const text = `UPDATE rs SET status = 2 Where id IN (${groupRSDocId})`;
      await client.query(text);
      resolve();
    });

    const promise_linesRS_update = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE rs_line SET remain_qty = remain_qty - ${
          line.qty
        } Where id = ${line.id} AND rs_id = ${line.rs_id}`;

        await client.query(text);

        resolve();
      });
    });

    //#endregion RS

    //#region Item

    const promise_linesItem_query = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE item SET qty = qty - ${line.qty} Where id = ${
          line.item_id
        }`;

        await client.query(text);

        resolve();
      });
    });

    //#endregion Item
    Promise.all([
      promise_docDN_update,
      promise_linesDN_query,
      promise_docRS_update,
      promise_linesRS_update,
      promise_linesItem_query
    ])
      .then(() => {
        res.send({ id: newId });
      })
      .catch(error => {
        res.send(error);
      });
  });

  app.get("/api/dn/list/:page", isAuthenticated, async (req, res) => {
    const { page } = req.params;

    const data = await client.query(
      `SELECT * from dn order by last_modify_time desc OFFSET ${(page - 1) *
        30} ROWS FETCH NEXT 30 ROWS ONLY;`
    );

    const result = {
      data: data.rows,
      HasMore: data.rows.length === 30
    };

    res.send(result);
  });

  app.get("/api/dn/form/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    const doc = new Promise(async (resolve, reject) => {
      const result = await client.query(`select * from dn where id = ${id}`);

      resolve(result);
    });

    const lines = new Promise(async (resolve, reject) => {
      const result = await client.query(
        `SELECT dn_line.* , rs.code AS rs_code from dn_line left join rs on dn_line.ref_doc_id = rs.id where dn_line.dn_id = ${id}
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

  app.delete("/api/dn/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { name: UserName } = req.user;
    const { document, lines } = req.body;

    if (!id) res.status(400).send("need id of item category");

    const promise_linesRS_updatequery = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE rs_line SET remain_qty = remain_qty + ${
          line.qty
        } Where id = ${line.ref_line_id}`;
        await client.query(text);
        resolve();
      });
    });

    const promise_linesItem_updatequery = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE item SET qty = qty + ${line.qty} Where id = ${
          line.item_id
        }`;
        await client.query(text);
        resolve();
      });
    });

    const promise_docDN_deletequery = new Promise(async (resolve, reject) => {
      const text = `DELETE from dn Where id = ${id}`;

      await client.query(text);
      resolve();
    });

    const promise_linesDN_deletequery = new Promise(async (resolve, reject) => {
      const text = `DELETE from dn_line Where dn_id = ${id}`;

      await client.query(text);
      resolve();
    });

    await Promise.all([
      promise_linesRS_updatequery,
      promise_linesItem_updatequery,
      promise_docDN_deletequery,
      promise_linesDN_deletequery
    ]);

    const groupRSDocId = join(uniq(map(lines, "ref_doc_id")));

    const text = `SELECT rs_id , SUM(qty) as SUM_QTY , SUM(remain_qty) as SUM_REMAIN from rs_line where rs_id in (${groupRSDocId}) group by rs_id`;
    const { rows: RsLines } = await client.query(text);
    const RsLinesRemainComplete = RsLines.filter(
      line => line.sum_qty === line.sum_remain
    );

    if (RsLinesRemainComplete.length !== 0) {
      const RsLinesString = join(uniq(map(RsLinesRemainComplete, "rs_id")));

      const text = `UPDATE rs SET status = 1 Where id in (${RsLinesString})`;

      await client.query(text);
    }

    res.send();
  });

  app.put("/api/dn/:id", isAuthenticated, async (req, res) => {
    let array_promise = [];
    const { id } = req.params;
    const { name: UserName } = req.user;

    const { document, lines } = req.body;

    const promise_doc_query = new Promise(async (resolve, reject) => {
      const text = `UPDATE dn SET remark = $1, contact_address = $2 , contact_id = $3 , contact_org = $4 
      ,last_modify_by = $5, last_modify_time = $6 Where id = ${id}`;
      const values = [
        document.remark,
        document.contact.address,
        document.contact.id,
        document.contact.org,
        UserName,
        new Date()
      ];

      await client.query(text, values);
      resolve();
    });

    array_promise.push(promise_doc_query);

    const promise_lines_updatequery = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE dn_line SET remark = $1
        ,last_modify_by = $2, last_modify_time = $3 Where id = ${line.id}`;
        const values = [line.remark, UserName, new Date()];

        await client.query(text, values);

        resolve();
      });
    });
    array_promise.push(promise_lines_updatequery);

    await Promise.all(array_promise);

    res.send();
  });

  app.get("/api/dn/getDNtoRN/:code", isAuthenticated, async (req, res) => {
    const { code } = req.params;

    const { rowCount, rows: document } = await client.query(
      `SELECT * from dn WHERE code = '${code}' AND status = 1 limit 1`
    );
    if (rowCount !== 1 || document.length == 0) res.send();
    else {
      const { id } = document[0];
      const { rows: lines } = await client.query(
        `SELECT * from dn_line WHERE dn_id = ${id}`
      );
      const data = {
        document: document[0],
        lines: lines
      };

      res.send(data);
    }
  });

  app.get("/api/po/DNReadyToUse", isAuthenticated, async (req, res) => {
    const data = await client.query(
      `Select * from dn where status = 1 order by id desc`
    );

    const result = {
      data: data.rows
    };

    res.send(result);
  });
};
