const sgMail = require('@sendgrid/mail')

const sendGridAPIKey = process.env.SEND_GRID_API_KEY

sgMail.setApiKey(sendGridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        from: 'henaadane@gmail.com',
        to: email,
        subject: 'Welcome to our app!',
        html: `<h1> A warm welcome for joining our app, ${name}! </h1>`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        from: 'henaadane@gmail.com',
        to: email,
        subject: 'Sorry to see you go!',
        text: 'And this is the text along with HTML',
        html: `<h1> We're sorry to see you go, ${name}! </h1>`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
