const sharp = require('sharp')

const User = require('../models/user')
const { sendCancelationEmail } = require('../helpers/emails/account')

const viewProfile = (req, res) => {
    if (req.user) {
        return res.status(200).send(req.user)
    }

    res.status(401).send('Unauthorized access!')
}

const getUser = async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(200).send('Couldn\'t find user!')
        }

        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }

}

const updateUser = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send('Invalid updates!')
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()

        res.status(201).send(req.user)

    } catch (error) {
        res.status(400).send(error)
    }
}

const deleteUser = async (req, res) => {
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
}

const uploadImage = async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send('File uploaded successfully!')
}

const deleteImage = async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()

        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e.message)
    }
}

const getImage = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')

        res.send(user.avatar)
    } catch (e) {
        res.status(400).send(e.message)
    }
}

module.exports = {
    viewProfile,
    getUser,
    updateUser,
    deleteUser,
    uploadImage,
    deleteImage,
    getImage
}
