const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = require('express').Router();

const Users = require('../users/users-model.js');
const { isValid } = require('../users/users-service.js');
const constants = require('../config/constants.js');

router.post('/register', (req, res) => {
    const credentials = req.body;

    if (isValid(credentials)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;

        const hash = bcryptjs.hashSync(credentials.password, rounds);

        credentials.password = hash;

        Users.add(credentials)
            .then(user => {
                res.status(201).json({ data: user });
            })
            .catch(err => {
                res.status(500).json({ message: err.message });
            });
    } else {
        res.status(400).json({
            message: 'please give the right credentials'
        });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (isValid(req.body)){
        Users.findBy({ username: username })
            .then(([user]) => {

                if (user && bcryptjs.compareSync(password, user.password)) {
                    const token = signToken(user);

                    res.status(200).json({
                        message: 'Welcome to the jungle',
                        token,
                    });
                } else {
                    res.status(401).json({ message: 'Not valid'});
                }
            })
            .catch(err => {
                res.status(500).json({ message: err.message });
            });
    } else {
        res.status(400).json({
            message: 'please give the right credentials',
        });
    }

});

function signToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        role: user.role,
    };

    const secret = constants.jwtSecret;

    const options = {
        expiresIn: '1d',
    };

    return jwt.sign(payload, secret, options);
}

module.exports = router;