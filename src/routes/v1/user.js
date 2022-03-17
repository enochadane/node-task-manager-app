const express = require('express')

const auth = require('../../middleware/auth')
const upload = require('../../middleware/multer')
const { viewProfile,
    getUser,
    updateUser,
    deleteUser,
    uploadImage,
    deleteImage,
    getImage } = require('../../controllers/user')

const router = new express.Router()

router.get('/me', auth, viewProfile)

router.get('/:id', getUser)

router.patch('/me', auth, updateUser)

router.delete('/me', auth, deleteUser)

router.post('/me/avatar', auth, upload.single('avatar'), uploadImage,
    (error, req, res, next) => {
        res.status(400).send(error.message)
    })

router.delete('/me/avatar', auth, deleteImage)

router.get('/:id/avatar', getImage)

module.exports = router
