const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

// create new user at /
router.post('/', userController.createUser)
// login am existeing user
router.post('/login', userController.loginUser)
//update an existing user based on id
router.post('/:id', userController.auth, userController.updateUser)
// delete a user
router.delete('/:id', userController.auth, userController.deleteUser)

module.exports = router