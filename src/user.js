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

//user
// define the book model
const Users = sequelize.define('Users', {
    users_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone_number: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// create the table if it doesn't exist
sequelize.sync()


// route to get all books
app.get("/users", (req, res) => {
   Users.findAll().then(users => {
       res.json(users);
   }).catch(err => {
       res.status(500).send(err);
   });
});

// route to get a book by id
app.get('/users/:id', (req, res) => {
    Users.findByPk(req.params.id).then(users => {
        if (!users)
            res.status(404).send();
        else
            res.json(users);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to add a new book
app.post('/users', (req, res) => {
    Users.create(req.body).then(users => {
        res.json(users);
    }
    ).catch(err => {
        res.status(500).send(err);
    });
});

// route to update a book
app.put('/users/:id', (req, res) => {
    Users.findByPk(req.params.id).then(users => {
        if (!users)
            res.status(404).send();
        else
            users.update(req.body).then(users => {
                res.json(users);
            }).catch(err => {
                res.status(500).send(err);
            });
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to delete a book
app.delete('/users/:id', (req, res) => {
    Users.findByPk(req.params.id).then(users => {
        if (!users)
            res.status(404).send();
        else
            users.destroy().then(() => {
                res.json(users);
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