const isAuthenticated = require("../middlewares/Authenticated");
const moment = require("moment");
const { map, join, uniq, sumBy } = require("lodash");

module.exports = (app, client) => {
  app.post("/api/rn", isAuthenticated, async (req, res) => {
    const { name: UserName } = req.user;
    const { document, lines } = req.body;

    // console.log(req.body);
    // res.send();

    const LastDocument = await client.query(
      `SELECT setval('rn_id_seq',nextval('rn_id_seq')-1) AS id;`
    );

    const newId = parseInt(LastDocument.rows[0].id) + 1;

    //#region RN
    const promise_docRN_update = new Promise(async (resolve, reject) => {
      const text_document = `INSERT INTO rn(code, date, remark , status , contact_address 
        , contact_id , contact_org , amount, ref_doc_id, create_by, create_time, last_modify_by, last_modify_time)
        VALUES($1, $2, $3, $4, $5,$6, $7 , $8, $9 , $10 , $11, $12 , $13) RETURNING id `;

      const generateCode = `RN-${newId}`;

      const amount = sumBy(lines, line => {
        return line.qty * line.unit_price;
      });

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
        document.refDocId,
        UserName,
        new Date(),
        UserName,
        new Date()
      ];

      await client.query(text_document, values);
      resolve();
    });

    const promise_linesRN_query = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text_lines = `INSERT INTO rn_line (rn_id, item_id, item_name , qty , remain_qty
          ,unit_id ,unit_name, remark, ref_doc_id, ref_line_id
          ,create_by, create_time, last_modify_by, last_modify_time, uuid)
          VALUES($1, $2, $3, $4, $5,$6, $7 , $8 ,$9 , $10, $11, $12, $13, $14, $15)`;
        const values = [
          newId,
          line.item_id,
          line.item_name,
          line.qty,
          line.qty,
          line.unit_id,
          line.unit_name,
          line.remark,
          line.dn_id,
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

    //#endregion RN

    //#region DN

    const promise_linesDN_update = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE dn_line SET remain_qty = remain_qty - ${
          line.qty
        } Where id = ${line.id} AND dn_id = ${line.dn_id}`;

        await client.query(text);

        resolve();
      });
    });

    const promise_DocDN_update = new Promise(async (resolve, reject) => {
      const groupDNDocId = join(uniq(map(lines, "dn_id")));

      const text = `UPDATE dn SET status = 2 Where id in (${groupDNDocId})`;
      await client.query(text);

      resolve();
    });

    //#endregion DN

    //#region RS

    const promise_linesRS_update = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE rs_line SET remain_qty = remain_qty + ${
          line.qty
        } Where id = ${line.ref_line_id} AND rs_id = ${line.ref_doc_id}`;

        await client.query(text);

        resolve();
      });
    });

    //#endregion RS

    //#region Item

    const promise_linesItem_query = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE item SET qty = qty + ${line.qty} Where id = ${
          line.item_id
        }`;

        await client.query(text);

        resolve();
      });
    });

    //#endregion Item
    await Promise.all([
      promise_docRN_update,
      promise_linesRN_query,
      promise_linesDN_update,
      promise_DocDN_update,
      promise_linesRS_update,
      promise_linesItem_query
    ]);

    // const groupDNDocId = join(uniq(map(lines, "dn_id")));

    // const text = `SELECT dn_id , SUM(qty) as SUM_QTY , SUM(remain_qty) as SUM_REMAIN from dn_line where dn_id in (${groupDNDocId}) group by dn_id`;
    // const { rows: DNLines } = await client.query(text);

    // const DNLinesRemainComplete = DNLines.filter(line => line.sum_remain == 0);

    // if (DNLinesRemainComplete.length !== 0) {
    //   const DNLinesString = join(uniq(map(DNLinesRemainComplete, "dn_id")));

    //   const text = `UPDATE dn SET status = 2 Where id in (${DNLinesString})`;

    //   await client.query(text);
    // }

    res.send({ id: newId });
  });

  app.get("/api/rn/list/:page", isAuthenticated, async (req, res) => {
    const { page } = req.params;

    // const data = await client.query(
    //   `SELECT rn.* , dn.code AS dn_code from rn left join dn on rn.ref_doc_id = dn.id
    //   order by last_modify_time desc OFFSET ${(page - 1) *
    //     30} ROWS FETCH NEXT 30 ROWS ONLY;`
    // );

    const data = await client.query(
      `SELECT rn.* , dn.code AS dn_code from rn left join dn on rn.ref_doc_id = dn.id 
      order by last_modify_time desc`
    );
    const result = {
      data: data.rows,
      HasMore: data.rows.length === 30
    };

    res.send(result);
  });

  app.get("/api/rn/form/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;

    const doc = new Promise(async (resolve, reject) => {
      const result = await client.query(
        `select rn.* , dn.code as dn_code , dn.date as dn_date from rn left join dn on rn.ref_doc_id = dn.id where rn.id = ${id}`
      );

      resolve(result);
    });

    const lines = new Promise(async (resolve, reject) => {
      const result = await client.query(
        `SELECT * from rn_line where rn_id = ${id}
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

  app.delete("/api/rn/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { name: UserName } = req.user;
    const { document, lines } = req.body;

    if (!id) res.status(400).send("need id of item category");

    const promise_linesDN_updatequery = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE dn_line SET remain_qty = remain_qty + ${
          line.qty
        } Where id = ${line.ref_line_id}`;
        await client.query(text);
        resolve();
      });
    });

    const promise_linesItem_updatequery = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE item SET qty = qty - ${line.qty} Where id = ${
          line.item_id
        }`;
        await client.query(text);
        resolve();
      });
    });

    const promise_linesRS_update = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE rs_line rs
        SET    remain_qty = rs.remain_qty - ${line.qty}
        FROM   rn_line  rn
        JOIN   dn_line dn ON dn.id = rn.ref_line_id
        AND    dn.dn_id = rn.ref_doc_id					   
        WHERE  rs.id = dn.ref_line_id AND rs.rs_id = dn.ref_doc_id AND rn.id = ${
          line.id
        }`;

        await client.query(text);

        resolve();
      });
    });

    //UPDATE
    await Promise.all([
      promise_linesDN_updatequery,
      promise_linesItem_updatequery,
      promise_linesRS_update
    ]);

    const promise_docDN_deletequery = new Promise(async (resolve, reject) => {
      const text = `DELETE from rn Where id = ${id}`;

      await client.query(text);
      resolve();
    });

    const promise_linesDN_deletequery = new Promise(async (resolve, reject) => {
      const text = `DELETE from rn_line Where rn_id = ${id}`;

      await client.query(text);
      resolve();
    });

    //DELETE
    await Promise.all([promise_docDN_deletequery, promise_linesDN_deletequery]);

    const groupDNDocId = join(uniq(map(lines, "ref_doc_id")));

    const text = `SELECT dn_id , SUM(qty) as SUM_QTY , SUM(remain_qty) as SUM_REMAIN from dn_line where dn_id in (${groupDNDocId}) group by dn_id`;
    const { rows: DNLines } = await client.query(text);
    const DNLinesRemainComplete = DNLines.filter(
      line => line.sum_qty === line.sum_remain
    );

    if (DNLinesRemainComplete.length !== 0) {
      const DNLinesString = join(uniq(map(DNLinesRemainComplete, "dn_id")));

      const text = `UPDATE dn SET status = 1 Where id in (${DNLinesString})`;

      await client.query(text);
    }

    res.send();
  });

  app.put("/api/rn/:id", isAuthenticated, async (req, res) => {
    let array_promise = [];
    const { id } = req.params;
    const { name: UserName } = req.user;

    const { document, lines } = req.body;

    const promise_doc_query = new Promise(async (resolve, reject) => {
      const text = `UPDATE rn SET date = $1, remark = $2 
      ,last_modify_by = $3, last_modify_time = $4 Where id = ${id}`;
      const values = [document.date, document.remark, UserName, new Date()];

      await client.query(text, values);
      resolve();
    });

    array_promise.push(promise_doc_query);

    const promise_lines_updatequery = lines.map(line => {
      return new Promise(async (resolve, reject) => {
        const text = `UPDATE rn_line SET remark = $1
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
};
