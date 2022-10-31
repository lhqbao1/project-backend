import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resvole, reject) => {
        try {
            let hashPasswordFromBrcypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBrcypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                roleId: data.STRING,
                phoneNumber: data.phoneNumber,
            })
            resvole();
        } catch (e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resvole, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resvole(hashPassword);
        } catch (e) {
            reject(e)
        }
    })
}

let findAllUsers = () => {
    return new Promise((resvole, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resvole(users);
        } catch (e) {
            reject(e)
        }
    })
}

let getUserById = (userId) => {
    return new Promise(async (resvole, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            })
            if (user) {
                resvole(user)
            } else {
                resvole([])
            }
        } catch (e) {
            reject(e);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resvole, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.email = data.email;
                await user.save();
                resvole();
            } else {
                resvole();
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resvole, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (user) {
                await user.destroy();
                resvole();
            } else {
                resvole();
            }
        } catch (e) {
            reject(e);
        }
    })
}



module.exports = {
    createNewUser: createNewUser,
    findAllUsers: findAllUsers,
    getUserById: getUserById,
    updateUserData: updateUserData,
    deleteUser: deleteUser,
}