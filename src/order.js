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

//order
const Order = sequelize.define('order', {
    order_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Users,   // เชื่อมโยงกับ Users
            key: 'user_id'
        }
    },
    rental_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Rental, // เชื่อมโยงกับ Rental
            key: 'rental_id'
        }
    },
    return_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Return, // เชื่อมโยงกับ Return
            key: 'return_id'
        }
    }
});

// เชื่อมโยงความสัมพันธ์ระหว่าง Order กับ Rental และ Users
Order.belongsTo(Users, { foreignKey: 'user_id' });
Users.hasMany(Order, { foreignKey: 'user_id' });

Order.belongsTo(Rental, { foreignKey: 'rental_id' });
Rental.hasMany(Order, { foreignKey: 'rental_id' });

Order.belongsTo(Return, { foreignKey: 'return_id' });
Return.hasMany(Order, { foreignKey: 'return_id' });

// create the table if it doesn't exist
sequelize.sync()



// order
// route to get all books
app.get("/Order", (req, res) => {
   Return.findAll().then(returns => {
       res.json(returns);
   }).catch(err => {
       res.status(500).send(err);
   });
});

// route to get a book by id
app.get('/Order/:id', (req, res) => {
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
app.post('/Order', (req, res) => {
    Return.create(req.body).then(returns => {
        res.json(returns);
    }
    ).catch(err => {
        res.status(500).send(err);
    });
});

// route to update a book
app.put('/Order/:id', (req, res) => {
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
app.delete('/Order/:id', (req, res) => {
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