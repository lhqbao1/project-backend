import db from '../models/index';
import CRUDService from "../services/CRUDService";
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }

}

let getInfoMe = (req, res) => {
    return res.render('me.ejs');
}

let getCrud = (req, res) => {
    return res.render('crud.ejs');
}

let postCrud = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    return res.send('Success');
}

let displayCrud = async (req, res) => {
    let data = await CRUDService.findAllUsers();
    return res.render('displayCrud.ejs', {
        dataDisplay: data,
    });
}

let editCrud = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserById(userId);
        return res.render('editCrud.ejs', {
            userData: userData,
        });
    } else {
        res.send('User not found');
    }
}

let putCrud = async (req, res) => {
    let data = req.body;
    await CRUDService.updateUserData(data);
    return res.send('Success');

}

let deleteCrud = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUser(id);
        return res.send('success');
    } else {
        res.send('User not found');
    }
}



//export object
module.exports = {
    getHomePage: getHomePage,
    getInfoMe: getInfoMe,
    getCrud: getCrud,
    postCrud: postCrud,
    displayCrud: displayCrud,
    editCrud: editCrud,
    putCrud: putCrud,
    deleteCrud: deleteCrud,
}