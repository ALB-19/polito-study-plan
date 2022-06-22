'use strict';

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); // validation middleware
const passport = require('passport');

//POST /sessions
router.post('/', [
    check('username').isEmail().not().optional(),
    check('password').isStrongPassword({
        minLength: 8,
        minUppercase: 0,
        minLowercase: 0,
        minSymbols: 0,
        minNumbers: 0
    })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
    return res.status(422).json(" email e/o password non corretti!!!");
    passport.authenticate('local', (err, user) => {
        if (err) return res.status(err.status).json(err.message);

        req.login(user, (err) => {
            if (err) return next(err);
            return res.json(req.user);
        });
    })(req, res, next);
});

// DELETE /sessions/current
router.delete('/current', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
    })
    res.end();
})

// GET /current
router.get('/current', (req, res) => {
    if (req.isAuthenticated())
        return res.status(200).json(req.user);
    res.status(401).json({ message: 'Not authenticated' });
})

module.exports = router;