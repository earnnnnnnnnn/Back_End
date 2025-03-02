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
const Rental = sequelize.define('Rental', {
    rental_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // ✅ ค่าเริ่มต้นเป็นเวลาปัจจุบัน
                get() {
                    // ✅ แปลงเวลาให้อยู่ในรูปแบบ "YYYY-MM-DD HH:MM:SS"
                    return new Date(this.getDataValue('start_date'))
                        .toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
                }
    },
    end_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // ✅ ค่าเริ่มต้นเป็นเวลาปัจจุบัน
                get() {
                    // ✅ แปลงเวลาให้อยู่ในรูปแบบ "YYYY-MM-DD HH:MM:SS"
                    return new Date(this.getDataValue('end_date'))
                        .toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
                }
    },
    total_price: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    users_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    camera_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

// create the table if it doesn't exist
sequelize.sync()


// route to get all books
app.get("/rental", (req, res) => {
   Rental.findAll().then(rental => {
       res.json(rental);
   }).catch(err => {
       res.status(500).send(err);
   });
});

// route to get a book by id
app.get('/rental/:id', (req, res) => {
    Rental.findByPk(req.params.id).then(rental => {
        if (!rental)
            res.status(404).send();
        else
            res.json(rental);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to add a new book
app.post('/rental', (req, res) => {
    Rental.create(req.body).then(rental => {
        res.json(rental);
    }
    ).catch(err => {
        res.status(500).send(err);
    });
});

// route to update a book
app.put('/rental/:id', (req, res) => {
    Rental.findByPk(req.params.id).then(rental => {
        if (!rental)
            res.status(404).send();
        else
            rental.update(req.body).then(rental => {
                res.json(rental);
            }).catch(err => {
                res.status(500).send(err);
            });
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to delete a book
app.delete('/rental/:id', (req, res) => {
    Rental.findByPk(req.params.id).then(rental => {
        if (!rental)
            res.status(404).send();
        else
            rental.destroy().then(() => {
                res.json(rental);
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