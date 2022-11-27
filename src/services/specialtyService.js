const db = require("../models")

let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
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
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll()
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data
            })
        } catch (e) {
            reject(e)
            console.log(e)
        }
    })
}

let getSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {

                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                })

                if (data) {
                    let doctorSpecialty = []
                    if (location === 'ALL') {

                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId
                            },
                            attributes: ['doctorID', 'provinceId']
                        })

                    } else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorID', 'provinceId']
                        })
                    }

                    data.doctorSpecialty = doctorSpecialty
                } else data = {}
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
    createNewSpecialty: createNewSpecialty,
    getAllSpecialty: getAllSpecialty,
    getSpecialtyById: getSpecialtyById
}