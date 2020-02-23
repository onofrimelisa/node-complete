// carga las variables de entorno
require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const cookieparser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

// where the sessions will be stored
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5e5149a5ff913d1844145e91')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

// cookies
app.use(cookieparser());
// session
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((result) => {
        // creo un usuario si no existe
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Melisa',
                    email: 'melisa@gmail.com',
                    cart: {
                        items: [],
                        quantity: 0
                    }
                });
                user.save();
            }
        }).catch(err => { throw err });

        app.listen(3000);
    }).catch((err) => {
        console.log(err);
        throw err;
    });