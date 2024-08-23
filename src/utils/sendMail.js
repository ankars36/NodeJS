const nodemailer = require("nodemailer")

const sendEmail = async (mailOptions) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.example.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log("error occured while sending email: ", error)

        return true
    })
}

module.exports = sendEmail