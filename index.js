require('dotenv').config();
const port = process.env.PORT || 3000;

const e = require('express');
const express = require("express");
const { model } = require('mongoose');
const app = express();
const Sequelize = require('sequelize');

app.use(express.json());

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './Database/CameraDB.sqlite',
});

//users
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
    }
});


//camera
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


//payment
const Payment = sequelize.define('Payment', {
    payment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    users_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references :{
            model:Users,
            key: "users_id"
          }
    },
    totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // กำหนดให้เป็นเวลาปัจจุบัน
    },
    endDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // กำหนดให้เป็นเวลาปัจจุบัน
    },
});

//order
const Order = sequelize.define('Orders', {
    order_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    payment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Payment,
            key: 'payment_id'
        }
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'users_id'
        }
    },
    camera_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Camera,
            key: 'camera_id'
        }
    },
});




//Cart
const Cart = sequelize.define('Cart', {
    cart_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
    },  
});


Order.belongsTo(Users, { foreignKey: 'user_id' });
Users.hasMany(Order, { foreignKey: 'user_id' });

Order.belongsTo(Payment, { foreignKey: 'payment_id' });
Payment.hasMany(Order, { foreignKey: 'payment_id' });


Users.hasMany(Cart, { foreignKey: 'users_id' });
Cart.belongsTo(Users, { foreignKey: 'users_id' });

Camera.hasMany(Cart, { foreignKey: 'camera_id' });
Cart.belongsTo(Camera, { foreignKey: 'camera_id' });


Payment.belongsTo(Users, { foreignKey: 'users_id' });
Users.hasMany(Payment, { foreignKey: 'users_id' });


sequelize.sync()


//user
app.get("/users", (req, res) => {
   Users.findAll().then(users => {
       res.json(users);
   }).catch(err => {
       res.status(500).send(err);
   });
});

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
 
 app.post('/camera', (req, res) => {
     Camera.create(req.body).then(camera => {
         res.json(camera);
     }
     ).catch(err => {
         res.status(500).send(err);
     });
 });
 
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



//Cart
app.get("/Cart", (req, res) => {
    Cart.findAll().then(cart => {
        res.json(cart);
    }).catch(err => {
        res.status(500).send(err);
    });
 });
 
 app.get('/Cart/:id', (req, res) => {
    Cart.findByPk(req.params.id).then(cart => {
         if (!cart)
             res.status(404).send();
         else
             res.json(cart);
     }).catch(err => {
         res.status(500).send(err);
     });
 });
 
 app.post('/Cart', (req, res) => {
    console.log(req.body);
    
    Cart.create(req.body).then(cart => {
         res.json(cart);
     }
     ).catch(err => {
         res.status(500).send(err);
     });
 });
 

 app.put('/Cart/:id', (req, res) => {
    Cart.findByPk(req.params.id).then(cart => {
         if (!cart)
             res.status(404).send();
         else
         cart.update(req.body).then(cart => {
                 res.json(cart);
             }).catch(err => {
                 res.status(500).send(err);
             });
     }).catch(err => {
         res.status(500).send(err);
     });
 });
 
app.delete('/Cart/:id/:uid', (req, res) => {
    const { id, uid } = req.params;

    Cart.findOne({ where: { camera_id: id, users_id: uid } }).then(cart => {
        if (!cart)
            res.status(404).send();
        else
            cart.destroy().then(() => {
                res.json(cart);
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
 
 app.post('/payment', (req, res) => {
     Payment.create(req.body).then(payment => {
         res.json(payment);
     }
     ).catch(err => {
         res.status(500).send(err);
     });
 });
 
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



// order
app.get("/Order", (req, res) => {
    Order.findAll().then(order => {
        res.json(order);
    }).catch(err => {
        res.status(500).send(err);
    });
 });
 
 app.get('/Order/:id', (req, res) => {
    Order.findByPk(req.params.id).then(order => {
         if (!order)
             res.status(404).send();
         else
             res.json(order);
     }).catch(err => {
         res.status(500).send(err);
     });
 });
 
 app.post('/Order', (req, res) => {
    Order.create(req.body).then(order => {
         res.json(order);
     }
     ).catch(err => {
         res.status(500).send(err);
     });
 });
 
 app.put('/Order/:id', (req, res) => {
    Order.findByPk(req.params.id).then(order => {
         if (!order)
             res.status(404).send();
         else
             order.update(req.body).then(order => {
                 res.json(order);
             }).catch(err => {
                 res.status(500).send(err);
             });
     }).catch(err => {
         res.status(500).send(err);
     });
 });
 
 app.delete('/Order/:id', (req, res) => {
    Order.findByPk(req.params.id).then(order => {
         if (!order)
             res.status(404).send();
         else
            order.destroy().then(() => {
                 res.json(order);
             }).catch(err => {
                 res.status(500).send(err);
             });
     }).catch(err => {
         res.status(500).send(err);
     });
 });
 


 const PORT = 3000;

 const { execSync } = require('child_process');
const { type } = require('os');
 
 const clearPort = (port) => {
     try {
         const result = execSync(`netstat -ano | findstr :${port}`).toString();
         const lines = result.trim().split('\n');
         
         lines.forEach(line => {
             const parts = line.trim().split(/\s+/);
             const pid = parts[parts.length - 1];
         
             execSync(`taskkill /PID ${pid} /F`);
             console.log(`\x1b[32mSuccessfully killed process on port ${port} (PID: ${pid})\x1b[0m`);
         });
     } 
     catch (error) {
         console.error(`\x1b[31m[ERROR]\x1b[0m Failed to clear port ${port}`);
     }
 };
 
 
 clearPort(PORT);
 
 app.listen(PORT, () => {
     console.log(`\x1b[44mWebpage running on http://localhost:${PORT}\x1b[0m`);
 });