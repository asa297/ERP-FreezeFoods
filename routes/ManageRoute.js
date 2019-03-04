const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DB_SQL,
  ssl: true
});

client.connect();

module.exports = app => {
  app.post("/api/itemcate", async (req, res) => {
    const text =
      "INSERT INTO item_category(name, create_by, create_time, last_modify_by, last_modify_time) VALUES($1, $2, $3, $4, $5) RETURNING id, name";
    const values = [req.body.name, "au", new Date(), "au", new Date()];
    // console.log(req.body);

    client.query(text, values, (err, value) => {
      if (err) {
        console.log(err.stack);
        res.status(400).send();
      } else {
        // console.log(value.rows[0]);
        res.send({ result: value.rows[0] });
        // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
      }
    });

    // res.status(400).send();
  });

  app.post("/api/testna", async (req, res) => {
    client.query("SELECT * from item_category", (err, res) => {
      if (err) throw err;
      console.log(res.rows);
      client.end();
    });
    res.send();
  });
};
