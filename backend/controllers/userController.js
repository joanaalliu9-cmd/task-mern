const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    //kontrollojme nese fushat jane bosh
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }

    //kontrollojme nese useri ekziston ne databaze
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User Exists')
    }
    

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword })
    if (user) {
        res.status(201);
        res.json({
            _id: user.id, name: user.name,
            email: user.email,
            token: generateJWTtoken(user.id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

const loginUser = asyncHandler(async (req, res) => {
        const { email, password } = req.body;

    //kontrollojme nese fushat jane bosh
    if ( !email || !password) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }

    //kontrollojme nese useri ekziston ne databaze
    const user = await User.findOne({ email });


    //krahaso nese useri ekziston dhe passwordi nga req.body me passwordin ne db
    if (user && await bcrypt.compare(password, user.password)) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateJWTtoken(user.id)
        })
    } else {
        res.status(400);
        throw new Error('Invalid data')
    }
})


const getCurrentUser = asyncHandler(async (req, res) => {
    const {_id, name, email } = await User.findById(req.user.id)
    res.status(200).json({ id: _id, name, email })
})


const generateJWTtoken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5d' });

module.exports = { registerUser, loginUser, getCurrentUser }