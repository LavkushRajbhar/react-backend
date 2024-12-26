const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: "rajbharlav90@gmail.com", // replace with your email
            pass: "ybjw lciy hcnc bxnq", // replace with your app-specific password
        },
    });

    try {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Hey 👻" <rajbharlav90@gmail.com>', // sender address
            to: data.to, // list of receivers
            subject: data.subject, // Subject line
            text: data.text, // plain text body
            html: data.htm, // html body
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
});

module.exports = sendEmail;
