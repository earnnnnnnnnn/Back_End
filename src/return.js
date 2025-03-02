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

// define the book model
const Return = sequelize.define('Return', {
    return_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    rental_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    return_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // ✅ ค่าเริ่มต้นเป็นเวลาปัจจุบัน
                get() {
                    // ✅ แปลงเวลาให้อยู่ในรูปแบบ "YYYY-MM-DD HH:MM:SS"
                    return new Date(this.getDataValue('return_date'))
                        .toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
                }
    },
    condition: {
        type: Sequelize.STRING,
        allowNull: false
    },
    extra_charge: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// create the table if it doesn't exist
sequelize.sync()


// route to get all books
app.get("/return", (req, res) => {
   Return.findAll().then(returns => {
       res.json(returns);
   }).catch(err => {
       res.status(500).send(err);
   });
});

// route to get a book by id
app.get('/return/:id', (req, res) => {
    Return.findByPk(req.params.id).then(returns => {
        if (!returns)
            res.status(404).send();
        else
            res.json(returns);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to add a new book
app.post('/return', (req, res) => {
    Return.create(req.body).then(returns => {
        res.json(returns);
    }
    ).catch(err => {
        res.status(500).send(err);
    });
});

// route to update a book
app.put('/return:id', (req, res) => {
    Return.findByPk(req.params.id).then(returns => {
        if (!returns)
            res.status(404).send();
        else
            returns.update(req.body).then(returns => {
                res.json(returns);
            }).catch(err => {
                res.status(500).send(err);
            });
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to delete a book
app.delete('/return/:id', (req, res) => {
    Return.findByPk(req.params.id).then(returns => {
        if (!returns)
            res.status(404).send();
        else
            returns.destroy().then(() => {
                res.json(returns);
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