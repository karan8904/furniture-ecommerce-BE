import nodemailer from 'nodemailer'

const sendMail = async (email, subject, body, file) => {
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
        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: subject,
            html: body
        };

        if (file) {
            mailOptions.attachments = [
                {
                    filename: 'invoice.pdf',
                    content: file,
                    contentType: 'application/pdf'
                }
            ];
        }


        await transporter.sendMail(mailOptions)
        console.log("Email sent successfully.")
    } catch (error) {
        console.log("Cannot send an email...")
    }
}

export default sendMail