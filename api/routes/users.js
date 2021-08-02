const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth');

const User = require('../models/user');
const user = require('../models/user');

// /**
//  * @swagger
//  * components:
//  *  schemas:
//  *   User:
//  *    type: object
//  *     properties:
//  *      id:
//  *       type: string
//  */

// /**
//  * @swagger
//  *  /user/getlistofusers:
//  *   get:
//  *    summary: Return list of users
//  *     responses:
//  *      200:
//  *       content:
//  *        application/json:
//  *         schema:
//  *          type: array
//  *           items:
//  *            $ref: '#/components/schemas/User'
//  */

router.get('/getlistofusers', (req, res, next) => {
    User.find()
    .select('_id name email pwd')
    .exec()
    .then(docs => {
        console.log(docs)
        res.status(200).json(docs);            
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/getall', checkAuth, (req, res, next) => {
    User.find()
    .select('_id name email pwd')
    .exec()
    .then(docs => {
        console.log(docs)
        res.status(200).json(docs);            
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});


router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message: "Email already exists"
            })
        }
        else{
            bcrypt.hash(req.body.pwd, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    })
                }
                else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        pwd: hash
                    })
                    user.save().then(result => {
                        console.log(result);
                        res.status(200).json({
                            message: 'User created',
                        });
                    }).catch(err => {
                        console.log(err)
                        res.status(500).json({error: err});
                    });
                }
            });
        }
    });
    
    
});

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){            
            return res.status(402).json({
                message: "Auth failed"
            })
        }
        bcrypt.compare(req.body.pwd, user[0].pwd, (err,result) => {
            if(err){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, 
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: "Auth successful",
                    email: user[0].email,
                    name: user[0].name,
                    token: token
                });
            }
            res.status(401).json({
                message: "Auth failed"
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
})

// router.get('/:userId', (req, res, next) => {
//     const id = req.params.userId;
//     User.findById(id)
//     .exec()
//     .then(doc => {
//         console.log(doc)
//         if (doc) {
//             res.status(200).json(doc);            
//         }
//         else{
//             res.status(404).json({message: "Data does not exist"});            
//         }
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json({error: err});
//     });
// });

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.update({ _id: id}, {$set: { updateOps}})
    .exec()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
    .exec()
    .then(result => {
            res.status(200).json(result);            
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.delete('/delete/all', (req, res, next) => {
    User.remove()
    .exec()
    .then(docs => {
        console.log(docs)
        res.status(200).json(docs);            
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

module.exports = router;