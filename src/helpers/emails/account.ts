import sgMail from '@sendgrid/mail'
import configs from '../../config/config'

const sendGridAPIKey: string = configs.SEND_GRID_API_KEY

sgMail.setApiKey(sendGridAPIKey)

const sendWelcomeEmail = (email: string, name: String) => {
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

export {
    sendWelcomeEmail,
    sendCancelationEmail
}
