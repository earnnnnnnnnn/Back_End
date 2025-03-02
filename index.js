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

//users
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


//camera
// define the book model
const Camera = sequelize.define('Camera', {
    camera_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
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


//rental
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


//user
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



//camera
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



//rental
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



//return
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


//payment
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
 app.put('/payment:id', (req, res) => {
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
 app.delete('/return/:id', (req, res) => {
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


//reservation
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
