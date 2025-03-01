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

// reservation
const Reservation = sequelize.define('Reservation', {
    reservation_id: {
        type: Sequelize.STRING,
        // autoIncrement: true,
        primaryKey: true
    },
    reservation_date:{
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // ✅ ค่าเริ่มต้นเป็นเวลาปัจจุบัน
        get() {
            // ✅ แปลงเวลาให้อยู่ในรูปแบบ "YYYY-MM-DD HH:MM:SS"
            return new Date(this.getDataValue('reservation_date'))
                .toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
        }
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    camera_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// create the table if it doesn't exist
sequelize.sync()

// route to get all books
app.get("/reservation", (req, res) => {
    Reservation.findAll().then(reservation => {
       res.json(reservation);
   }).catch(err => {
       res.status(500).send(err);
   });
});

// route to get a book by id
app.get('/reservation/:id', (req, res) => {
    Reservation.findByPk(req.params.id).then(reservation => {
        if (!reservation)
            res.status(404).send();
        else
            res.json(reservation);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to add a new book
app.post('/reservation', (req, res) => {
    Reservation.create(req.body).then(reservation => {
        res.json(reservation);
    }
    ).catch(err => {
        res.status(500).send(err);
    });
});

// route to update a book
app.put('/reservation:id', (req, res) => {
    Reservation.findByPk(req.params.id).then(reservation => {
        if (!reservation)
            res.status(404).send();
        else
            reservation.update(req.body).then(reservation => {
                res.json(reservation);
            }).catch(err => {
                res.status(500).send(err);
            });
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to delete a book
app.delete('/reservation/:id', (req, res) => {
    Reservation.findByPk(req.params.id).then(reservation => {
        if (!reservation)
            res.status(404).send();
        else
            reservation.destroy().then(() => {
                res.json(reservation);
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