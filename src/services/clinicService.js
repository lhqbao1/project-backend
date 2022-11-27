const db = require("../models")

let createNewClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    image: data.imageBase64,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'create success'
                })
            }
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll()
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Success',
                data
            })
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}

let getClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            if (inputId) {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    }
                })
                if (data) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                    let doctorClinic = []
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: inputId
                        },
                        attributes: ['doctorID']
                    })
                    data.doctorClinic = doctorClinic

                }
                resolve({
                    errCode: 0,
                    errMessage: 'Success',
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
    createNewClinic: createNewClinic,
    getAllClinic: getAllClinic,
    getClinicById: getClinicById
}