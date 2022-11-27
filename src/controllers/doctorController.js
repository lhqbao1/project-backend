import doctorService from "../services/doctorService";

let getDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getDoctor(+limit);
        // console.log(response)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getAllDoctor = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctor()
        return res.status(200).json(doctors)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.postInfoDoctor(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getInfoDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getInfoDoctorById(req.query.id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let BulkCreateSchedule = async (req, res) => {
    try {
        let response = await doctorService.BulkCreateSchedule(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        //recieve doctorID and date from client
        let data = await doctorService.getScheduleByDate(req.query.doctorID, req.query.date)
        console.log(data)
        return res.status(200).json(
            data
        )
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getMoreInfoDoctorById = async (req, res) => {
    try {
        //recieve doctorID and date from client
        let infor = await doctorService.getMoreInfoDoctorById(req.query.doctorID)
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getProfileDoctorById = async (req, res) => {
    try {
        let profile = await doctorService.getProfileDoctorById(req.query.doctorID)
        return res.status(200).json(
            profile
        )
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getListPatient = async (req, res) => {
    try {
        let infor = await doctorService.getListPatient(req.query.doctorId, req.query.date)
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
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