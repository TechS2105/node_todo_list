import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = new pg.Client({

  user: "postgres",
  host: "localhost",
  database: "parmalist",
  password: "12345",
  port: 5432

});

db.connect();

app.get('/', async (req, res) => {

  const result = await db.query("SELECT * FROM items");
  let item = [];
  item = result.rows;
  res.render('index.ejs', {listItems: item, listTitle: "Today"});

});

app.post('/add', async (req, res) => {
  
  const newItem = req.body.newItem;

  await db.query("INSERT INTO items(title) VALUES($1)", [newItem]);
  res.redirect('/');

});

app.post('/edit', async (req, res) => {
  
  const editedItemTitle = req.body.updatedItemTitle;
  const editedItemId = req.body.updatedItemId;

  await db.query("UPDATE items SET title = $1 WHERE id = $2", [editedItemTitle, editedItemId]);
  res.redirect('/');

});

app.post('/delete', async (req, res) => {
  
  const deleteItem = req.body.deleteItemId;
  const result = await db.query("DELETE FROM items WHERE id = $1", [deleteItem]);
  res.redirect('/');

});

app.listen(port, () => {

  console.log(`Server is started on ${port} port`);

})