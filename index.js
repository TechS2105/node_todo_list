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

async function getItems() {
  
  const result = await db.query("SELECT * FROM items");
  let items = [];
  items = result.rows;
  return items;

}

app.get('/', async (req, res) => {
  
  const items = await getItems();
  res.render('index.ejs', {listTitle: "Today", listItems: items});

});

// add items 
app.post('/add', async (req, res) => {
  
  const newItems = req.body.newItem;
  
  try { 

    await db.query("INSERT INTO items(title) VALUES($1)", [newItems]);
    res.redirect('/');

  } catch (err) {
    
    console.log(err);

  }

});

// update items
app.post('/edit', async (req, res) => {
  
  const id = req.body.updatedItemId;
  const item = req.body.updatedItemTitle;

  try {
    
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [item, id]);
    res.redirect('/');

  } catch (err) {
    
    console.log(err);

  }

});

// delete items 
app.post('/delete', async (req, res) => {
  
  const id = req.body.deleteItemId;

  try { 

    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect('/');

  } catch (err) {
    
    console.log(err);

  }

});

app.listen(port, () => {

  console.log(`Server is started on ${port} port`);

});