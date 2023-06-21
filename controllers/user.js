require('dotenv').config()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.SECRET)
        const user = await User.findOne({ _id: data._id })
        if(!user){
            throw new Error('invalid credentials')
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}
// we write out the save part in order to access the pre function we made that hashes the password for us
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.json({ user, token })

    } catch(error){
        res.status(400).json({ message: error.message })
}
}

exports.loginUser = async (req, res) => {
    try {
        // searches for user based on email
        const user = await User.findOne({ email: req.body.email })
        //if user doesnt exist or passwords dont match send an error
        if(!user || !await bcrypt.compare(req.body.password, user.password )){
            throw new Error('Invalid Login')
        } else {
            // if there is a user with the correct password we make an auth token and generate the specific users info and the valid token granting them access
            const token = await user.generateAuthToken()
            res.json({ user, token })
        }
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}

exports.updateUser = async (req, res) => {
    try {
        // we are making an array of all keys (ex. email, name, & password), and changing it based on the corresponding key in req.body
        const updates = Object.keys.apply(req.body)
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        // then we send the updated user back to the database
        res.json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await req.user.deleteOne()
        res.sendStatus(204)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}