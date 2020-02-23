const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

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

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://melisa:A3v7nWqPQmeZMmrg@cluster0-c5p8t.mongodb.net/shop?retryWrites=true&w=majority')
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