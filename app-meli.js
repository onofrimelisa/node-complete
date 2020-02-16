const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// database sin sequelize
// const db = require('./util/database');

// sequelize
const sequelize = require('./util/database');
const Product = require('./models/product');


// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use('/shop', shopRoutes);


// ###############################################################################
//										SELECT EN UNA SQL DB
// ###############################################################################
// db.execute('SELECT * FROM products').then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err);
// });

// ###############################################################################
//										INSERT EN UNA SQL DB
// ###############################################################################
// db.execute('INSERT INTO products (title, price, description, imageUrl) VALEUS (?,?,?,?)', ['La chiac del tren', 3.56, 'desc', 'url']);

// ###############################################################################
//										CON SEQUELIZE
// ###############################################################################
// crea todos los modelos que estan importados en app.js 
// para que se borren las tablas si ya existen se usa {force: trues}
sequelize.sync().then(() => {
    app.listen(3000);
}).catch((err) => {
    console.log(err);

}); //crea las tablas