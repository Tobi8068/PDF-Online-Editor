const User = require('../models/user');
const bcrypt = require('bcrypt');
const {jwtSign} = require('../utils/jwt');

const userSignup = async function (req, res) {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
          res.status(409).send('User already exists');
        } else {
          const newUser = new User({
            email: email,
            password: password,
            role: role
          });
          await newUser.save();
          res.status(201).send('User created successfully');
        }
      } catch (err) {
        res.status(500).send('Error occurred: ' + err.message);
      } 
}

const userSignin = async function (req, res) {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if (user) {
            const hashPassword = await bcrypt.hash(password, user.salt);
            if (hashPassword === user.password) {
                const token = jwtSign({
                    id: user._id,
                    email: user.email,
                });
                res.status(201).json({
                    token: token,
                    message: "User logined successfully"
                });
            } else {
                res.status(409).send('Password doesn\'t matches');    
            }
        } else {
            res.status(409).send('User doesn\'t exists');
        }
        
    } catch (error) {
        res.status(500).send('Error occurred: ' + error.message);
    }
}

module.exports = {
    userSignup,
    userSignin,
}