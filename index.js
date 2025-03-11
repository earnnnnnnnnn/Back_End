require('dotenv').config();
const port = process.env.PORT || 3000;

const express = require("express");
const { model } = require('mongoose');
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
        allowNull: false,
        unique: true
    },
    phone_number: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // address:{
    //     type: Sequelize.STRING,
    //     allowNull: false
    // }
});


//camera
// define the book model
const Camera = sequelize.define('Camera', {
    camera_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cameraimg: {
            type: Sequelize.STRING,
            allowNull: false
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
        allowNull: false,
        references :{
            model:Users,
            key: "users_id"
          }
    },
    camera_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references :{
            model:Camera,
            key: "camera_id"
        }
    }
});


//return
// define the book model
const Return = sequelize.define('Return', {
    return_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    rental_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references :{
            model:Rental,
            key: "rental_id"
        }
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
        allowNull: true
    },users_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references :{
            model:Users,
            key: "users_id"
          }
    },
    users_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references :{
            model:Users,
            key: "users_id"
        }
    },
    rental_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references :{
            model:Rental,
            key: "rental_id"
        }
    }
});


// reservation
const Reservation = sequelize.define('Reservation', {
    reservation_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
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
        type: Sequelize.INTEGER,
        allowNull: false,
        references :{
            model:Users,
            key: "users_id"
          }
    },
    camera_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references :{
            model:Camera,
            key: "camera_id"
        }
    }
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

// // ตั้งค่าความสัมพันธ์หลังจากประกาศโมเดล
Users.hasMany(Rental, { foreignKey: 'users_id' });
Rental.belongsTo(Users, { foreignKey: 'users_id' });

Camera.hasMany(Rental, { foreignKey: 'camera_id' });
Rental.belongsTo(Camera, { foreignKey: 'camera_id' });

// เชื่อมโยงความสัมพันธ์ระหว่าง Payment กับ Users และ Rental
Payment.belongsTo(Users, { foreignKey: 'users_id' });
Users.hasMany(Payment, { foreignKey: 'users_id' });

Rental.hasMany(Payment, { foreignKey: 'rental_id' });
Payment.belongsTo(Rental, { foreignKey: 'rental_id' });

Rental.hasOne(Return, { foreignKey: 'rental_id' });
Return.belongsTo(Rental, { foreignKey: 'rental_id' });

Camera.hasMany(Reservation, { foreignKey: 'camera_id' });
Reservation.belongsTo(Camera, { foreignKey: 'camera_id' });

Users.hasMany(Reservation, { foreignKey: 'user_id' });
Reservation.belongsTo(Users, { foreignKey: 'user_id' });


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
    console.log('Received data:', req.body); // ตรวจสอบข้อมูลที่ได้รับจากคำขอ
    Users.create(req.body).then(users => {
        console.log("pass");
        res.json(users);
    }).catch(err => {
        console.log("fail");
        console.error(err); // เพิ่มการแสดงข้อผิดพลาด
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
 app.get('/camera/:id', (req, res) => {
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
 app.delete('/camera/:id', (req, res) => {
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
    console.log(req.body);
    
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
app.delete('/rental/:id/:uid', (req, res) => {
    const { id, uid } = req.params;
    Rental.findOne({ where: { camera_id: id, users_id: uid } }).then(rental => {
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
 app.put('/return/:id', (req, res) => {
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
