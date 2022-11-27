import specialtyService from '../services/specialtyService'
let createNewSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.createNewSpecialty(req.body)
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

let getAllSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.getAllSpecialty()
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
let getSpecialtyById = async (req, res) => {
    try {
        let response = await specialtyService.getSpecialtyById(req.query.id, req.query.location)
        return res.status(200).json({
            response
        })
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllSpecialty: getAllSpecialty,
    getSpecialtyById: getSpecialtyById
}