const express = require('express');
const exphbs  = require('express-handlebars');
const AvoShopper = require("./avo-shopper");

const pg = require("pg");
const Pool = pg.Pool;


const app = express();

const connectionString = process.env.DATABASE_URL || "postgresql://codex:codex123@localhost:5432/my_avo_app";

const pool = new Pool({
	connectionString,
	ssl: {
		rejectUnauthorized: false
	}
});


// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

const avoShopper = AvoShopper(pool);


// let counter = 0;

app.get('/', async function(req, res) {
	const shops = await avoShopper.listShops()
	res.render('index', {
		shops
	});
});

app.get('/shops/shopList', async function (req, res) {

	const shop = await avoShopper.listShops()
	res.render('shops/shopList', {
		shop
	});
});

app.post('/shops/shopList', async function (req, res) {
	try {
		await avoShopper.createShop(req.body.shop_name);
	} catch (err) {
		console.log(err)
	}



	res.redirect('/shops/shopList')
});



// start  the server and start listening for HTTP request on the PORT number specified...
const PORT =  process.env.PORT || 3019;
app.listen(PORT, function() {
	console.log(`AvoApp started on port ${PORT}`)
});