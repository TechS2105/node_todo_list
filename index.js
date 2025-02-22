import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ ectended: true }));
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
    
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    let items = [];
    items = result.rows;
    return items;

}

app.get('/', async (req, res) => {
    
    const items = await getItems();
    try {
        res.render('index.ejs', { listItems: items, listTitle: "Today" });
    } catch (err) {
        console.log(err);
    }

});

app.post('/add', async (req, res) => {
    
    const newItem = req.body.newItem;
    
    try {
        
        const result = await db.query("INSERT INTO items(title) VALUES($1)", [newItem]);
        res.redirect('/');

    } catch (err) {
        
        console.log(err);

    }

});

app.post('/edit', async (req, res) => {
    
    const title = req.body.updatedItemTitle;
    const id = req.body.updatedItemId;

    try {
        
        const result = await db.query("UPDATE items SET title = $1 WHERE id = $2", [title, id]);
        res.redirect('/');

    } catch (err) {
        
        console.log(err);

    }

});

app.post('/delete', async (req, res) => {
    
    const delItem = req.body.deleteItemId;

    try {
        
        const result = await db.query("DELETE FROM items WHERE id = $1", [delItem]);
        res.redirect('/');

    } catch (err) {
        
        console.log(err);

    }

});

app.listen(port, () => {

    console.log(`Server is started on ${port} port`);

});