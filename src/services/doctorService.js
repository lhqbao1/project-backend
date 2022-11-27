import db from "../models/index";
require('dotenv').config();
import _ from 'lodash'
import { raw } from "body-parser";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getDoctor = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                where: {
                    roleId: 'R2'
                },
                limit: limitInput,
                order: [['createdAt', 'DESC']],
                attributes: {
                    extends: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['value_en', 'value_vi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['value_en', 'value_vi'] },
                    {
                        model: db.Doctor_Infor,
                        attributes: {
                            exclude: ['id', 'doctorID']
                        },
                        include: [
                            { model: db.Specialty, as: 'specialtyData' },


                        ]

                    },
                ],

                raw: true,
                nest: true
            })
            if (users && users.length > 0) {
                users.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }


            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password']
                }
            })
            // if (doctors && doctors.length > 0) {
            //     doctors.map(item => {
            //         item.image = new Buffer(item.image, 'base64').toString('binary')
            //         return item
            //     })
            // }
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}
let checkRequiredFields = (inputData) => {
    let arrFields = ['doctorId', 'contentMarkdown', 'contentHTML', 'action'
        , 'selectedPayment', 'selectedPrice', 'selectedProvince', 'nameClinic', 'addressClinic',
        'note', 'specialtyId', 'description'
    ]
    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i]
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}
let postInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData);
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            }
            else {
                //upsert to Markdown table
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save()
                    }
                }

                //upsert to Doctor_info table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false

                })
                if (doctorInfor) {
                    //update
                    doctorInfor.doctorID = inputData.doctorId;
                    doctorInfor.priceId = inputData.priceId;
                    doctorInfor.provinceId = inputData.provinceId;
                    doctorInfor.paymentId = inputData.paymentId;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.specialtyId;
                    doctorInfor.clinicId = inputData.clinicId

                    await doctorInfor.save()

                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorID: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        addressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    })
                }

            }
            resolve({
                errCode: 0,
                errMessage: 'Create doctor success!'
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getInfoDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        extends: ['password',]
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['value_en', 'value_vi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorID']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['value_vi', 'value_en'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['value_vi', 'value_en'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['value_vi', 'value_en'] }

                            ]
                            // attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                    ],
                    raw: true,
                    nest: true //for good format
                })
                data.image = new Buffer(data.image, 'base64').toString('binary')
                resolve({
                    errCode: 0,
                    data: data
                })

            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let BulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check req.body from client
            if (!data.arrSchedule) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                //create new object and set value 
                let schedule = data.arrSchedule
                //create a loop and set MAX_NUMBER_SCHEDULE for every item
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                //find which rangTime is existing 
                let existing = await db.Schedule.findAll({
                    where: { doctorID: data.doctorID, date: data.formatedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true,
                })
                //use lodash to find which one is not existing in db
                //by compare with 'existing'
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date
                });
                //use sequelize to create data in db
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Create schedule success'
                })
            }

        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}
let getScheduleByDate = (doctorID, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorID || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorID: doctorID,
                        date: date
                    },
                    //map data from schedule to allcode
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['value_en', 'value_vi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: true,
                    nest: true //for good format
                })
                if (!data) data = [];
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}

let getMoreInfoDoctorById = (doctorID) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorID) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let moreInfoDoctor = await db.Doctor_Infor.findOne({
                    where: { doctorID: doctorID },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['value_en', 'value_vi'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['value_en', 'value_vi'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['value_en', 'value_vi'] },
                    ],
                    raw: true,
                    nest: true
                })
                if (moreInfoDoctor) {
                    resolve({
                        errCode: 0,
                        moreInfoDoctor: moreInfoDoctor
                    })
                }
            }

        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        extends: ['password', 'image']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['value_en', 'value_vi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorID']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['value_vi', 'value_en'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['value_vi', 'value_en'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['value_vi', 'value_en'] }

                            ]
                            // attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },

                    ],

                    raw: true,
                    nest: true //for good format
                })
                data.image = new Buffer(data.image, 'base64').toString('binary')

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}

let getListPatient = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: ['firstName', 'email', 'gender', 'address'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['value_en', 'value_vi'] },
                            ],
                        },
                        { model: db.Allcode, as: 'timeTypeDataBooking', attributes: ['value_en', 'value_vi'] },
                    ],

                    raw: false,
                    nest: true
                })
                resolve({
                    data
                })
            }
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}
module.exports = {
    getDoctor: getDoctor,
    getAllDoctor: getAllDoctor,
    postInfoDoctor: postInfoDoctor,
    getInfoDoctorById: getInfoDoctorById,
    BulkCreateSchedule: BulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getMoreInfoDoctorById: getMoreInfoDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatient: getListPatient
}