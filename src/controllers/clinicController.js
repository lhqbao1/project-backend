import clinicService from "../services/clinicService"

let createNewClinic = async (req, res) => {
    try {
        let response = await clinicService.createNewClinic(req.body)
        return res.status(200).json({
            response
        })
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let response = await clinicService.getAllClinic()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getClinicById = async (req, res) => {
    try {
        let response = await clinicService.getClinicById(req.query.id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    createNewClinic: createNewClinic,
    getAllClinic: getAllClinic,
    getClinicById: getClinicById
}