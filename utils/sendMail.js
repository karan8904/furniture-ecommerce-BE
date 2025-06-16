import nodemailer from 'nodemailer'

const sendMail = async (email, subject, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.service,
            port: 587,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            html: body
        })
        console.log("Email send successfully.")
    } catch (error) {
        console.log("Cannot send an email...")
    }
}

export default sendMail