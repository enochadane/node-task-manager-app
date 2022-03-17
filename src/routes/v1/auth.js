const express = require('express')

const auth = require('../../middleware/auth')
const { signUp, signIn, signOut, signOutAll } = require('../../controllers/auth')
const upload = require('../../middleware/multer')

const router = express.Router()

router.post('/signUp', upload.single('avatar'), signUp)

router.post('/signIn', signIn)

router.post('/signOut', auth, signOut)

router.post('/signOutAll', auth, signOutAll)

module.exports = router
