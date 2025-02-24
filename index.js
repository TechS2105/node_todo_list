import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "parmalist",
  password: "12345",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function items() {
  const result = await db.query("SELECT * FROM items");
  let items = [];
  items = result.rows;
  return items;
}

app.get("/", async (req, res) => {
  const userItems = await items();
  res.render("index.ejs", { listTitle: "Today", listItems: userItems });
});

app.post("/add", async (req, res) => {
  const newItem = req.body.newItem;

  try {
    await db.query("INSERT INTO items(title) VALUES($1)", [newItem]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;

  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [title, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const deleteId = req.body.deleteItemId;

  try {
    await db.query("DELETE FROM items WHERE id = $1", [deleteId]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server is started on ${port} port`);
});
