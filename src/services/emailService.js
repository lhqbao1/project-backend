require('dotenv').config();
import nodemailer from 'nodemailer'
let sendEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Bao 👻" <luonghoangquocbao@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        text: "", // plain text body
        html: getBodyHTMLEmail(dataSend), // html body
    });
}
let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You received this email because you booked an online medical appointment</p>
        <p>Information of your appointment:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>If the above information is correct, please click on the link below to complete your appointment booking process!</p>
        <div><a href="${dataSend.redirectLink} target="_blank"">Click here</a></div>
        <div>Thank you for using our service</div>
        `
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng, vui lòng click vào đường link bên dưới để hoàn tất thủ tục đặt lịch khám bệnh của bạn!</p>
        <div><a href="${dataSend.redirectLink}">Click here</a></div>
        <div>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</div>
        `
    }
    return result
}
module.exports = {
    sendEmail: sendEmail
}