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
const Camera = sequelize.define('camera', {
    camera_id: {
        type: Sequelize.STRING,
        // autoIncrement: true,
        primaryKey: true
    },
    cameraname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    brand: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rental_price_per_day: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    replacement_cost: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
});

// create the table if it doesn't exist
sequelize.sync()


// route to get all books
app.get("/camera", (req, res) => {
   Camera.findAll().then(camera => {
       res.json(camera);
   }).catch(err => {
       res.status(500).send(err);
   });
});

// route to get a book by id
app.get('/camara/:id', (req, res) => {
    Camera.findByPk(req.params.id).then(camera => {
        if (!camera)
            res.status(404).send();
        else
            res.json(camera);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to add a new book
app.post('/camera', (req, res) => {
    Camera.create(req.body).then(camera => {
        res.json(camera);
    }
    ).catch(err => {
        res.status(500).send(err);
    });
});

// route to update a book
app.put('/camera/:id', (req, res) => {
    Camera.findByPk(req.params.id).then(camera => {
        if (!camera)
            res.status(404).send();
        else
            camera.update(req.body).then(camera => {
                res.json(camera);
            }).catch(err => {
                res.status(500).send(err);
            });
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to delete a book
app.delete('/users/:id', (req, res) => {
    Camera.findByPk(req.params.id).then(camera => {
        if (!camera)
            res.status(404).send();
        else
            camera.destroy().then(() => {
                res.json(camera);
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