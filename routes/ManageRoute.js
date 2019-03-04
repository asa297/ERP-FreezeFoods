const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DB_SQL,
  ssl: true
});

client.connect();

module.exports = app => {
  app.post("/api/testsql", async (req, res) => {
    client.query("SELECT * FROM item_category;", (err, res) => {
      if (err) throw err;
      console.log(res.rows);
      client.end();
    });

    res.send();
  });
};
