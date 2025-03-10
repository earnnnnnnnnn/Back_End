require('dotenv').config();
const port = process.env.PORT || 3000;

const express = require("express");
const app = express();
const Sequelize = require('sequelize');

// parse incoming requests
app.use(express.json());


// open a database connection
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './Database/CameraDB.sqlite',
});

//payment
// define the book model
const Payment = sequelize.define('Payment', {
    payment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    amount: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    payment_method: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rental_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

// create the table if it doesn't exist
sequelize.sync()


// route to get all books
app.get("/payment", (req, res) => {
   Payment.findAll().then(payment => {
       res.json(payment);
   }).catch(err => {
       res.status(500).send(err);
   });
});

// route to get a book by id
app.get('/payment/:id', (req, res) => {
    Payment.findByPk(req.params.id).then(payment => {
        if (!payment)
            res.status(404).send();
        else
            res.json(payment);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to add a new book
app.post('/payment', (req, res) => {
    Payment.create(req.body).then(payment => {
        res.json(payment);
    }
    ).catch(err => {
        res.status(500).send(err);
    });
});

// route to update a book
app.put('/payment/:id', (req, res) => {
    Payment.findByPk(req.params.id).then(payment => {
        if (!payment)
            res.status(404).send();
        else
            payment.update(req.body).then(payment => {
                res.json(payment);
            }).catch(err => {
                res.status(500).send(err);
            });
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to delete a book
app.delete('/payment/:id', (req, res) => {
    Payment.findByPk(req.params.id).then(payment => {
        if (!payment)
            res.status(404).send();
        else
            payment.destroy().then(() => {
                res.json(payment);
            }).catch(err => {
                res.status(500).send(err);
            });
    }).catch(err => {
        res.status(500).send(err);
    });
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});