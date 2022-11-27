import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorID, token) => {
    let result = '';
    result = `${process.env.URL_REACT}verify-booking?token=${token}&doctorID=${doctorID}`
    return result
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorID || !data.timeType || !data.date
                || !data.fullName || !data.selectedGender || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                // resolve({
                //     data
                // })
                // console.log(data)
                // return;
                let token = uuidv4()
                await emailService.sendEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorID, token)
                })
                //upsert patient
                let user = await db.User.findOrCreate({
                    where: {
                        email: data.email
                    },
                    defaults: {
                        email: data.email,
                        address: data.address,
                        gender: data.selectedGender,
                        roleId: 'R3',
                        firstName: data.fullName
                    }
                });
                //create a booking data
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorID,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }

                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor patient'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check revieced data
            if (!data.token || !data.doctorID) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                //find in Booking model
                let appointment = await db.Booking.findOne({
                    where: {
                        token: data.token,
                        doctorID: data.doctorID,
                        statusId: 'S1'
                    },
                    raw: false
                })
                //if appointment already exists, change from S1 to S2 (verified)
                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()

                    resolve({
                        errCode: 0,
                        errMessage: 'Update appointment success'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not existed'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}