const express = require('express');
const router = express.Router();
const Ninja = require('../models/ninja');
const User = require('../models/user');

router.get('/ninjas', (req, res, next) => {
    User.findById(req.user._id).populate('ninjas').exec()
        .then(user => {
            res.send(user.ninjas);
        })
        .catch(next);
});

router.post('/ninjas', (req, res, next) => {
    Ninja.create(req.body)
        .then(ninja => {
            ninja.user.push(req.user);
            ninja.save((err, data) => {
                if(err) {
                    console.log(err);
                }
            });

            User.findById(req.user._id)
                .then(user => {
                    user.ninjas.push(ninja);
                    user.save((err, data) => {
                        if(err){
                            console.log(err);
                        }
                    });
                })
                .catch(next);
            res.send(ninja);
        })
        .catch(next);
});

const allowPerm = (req, res, next) => {
    Ninja.findById(req.params.id)
        .then(ninja => {
            const ninjaUser = ninja.user[0].toString();
            const reqUser = req.user._id.toString();

            if(ninjaUser === reqUser) {
                return next();
            }
            res.status(403).send({
                err: 'permission denied!'
            });

        })
        .catch(next);
};

router.put('/ninjas/:id', allowPerm, (req, res, next) => {
    Ninja.findByIdAndUpdate({
        _id: req.params.id
    }, req.body)
        .then(() => {
            return Ninja.findOne({
                _id: req.params.id
            });
        })
        .then(ninja => {
            res.send(ninja);
        })
        .catch(next);
});

router.delete('/ninjas/:id', allowPerm, (req, res, next) => {
    Ninja.findByIdAndRemove({
        _id: req.params.id
    })
        .then(ninja => {
            res.send(ninja);
        })
        .catch(next);
});

module.exports = router;