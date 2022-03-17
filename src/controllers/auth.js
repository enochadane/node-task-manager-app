const User = require('../models/user')
const { sendWelcomeEmail } = require('../helpers/emails/account')

const signUp = async (req, res) => {
    const user = new User({ ...req.body, avatar: req.file.path })

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error.message)
    }

}

const signIn = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
}

const signOut = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.status(200).send('User Signed out!')
    } catch (e) {
        res.status(401).send('Unauthorized access!')
    }
}

const signOutAll = async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()

        res.status(200).send('Terminated all sessions!')
    } catch (e) {
        res.status(401).send('Unauthorized access!')
    }
}

module.exports = {
    signUp,
    signIn,
    signOut,
    signOutAll
}
