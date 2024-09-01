const { validationResult } = require("express-validator");
const { filterSensitiveInfo } = require("../helper/helper");
const { database } = require("../model/database");

let nextId = 2;

class UserController {
  static async getAllUsers(req, res) {
    const filteredUsers = database
      .filter((user) => user.name !== "Admin")
      .map(filterSensitiveInfo);

    return res.json({
      message: "Data user berhasil diambil",
      users: filteredUsers,
    });
  }

  static async updateUser(req,res) {
    const userId = req.user.id;
    const updateData = req.body;

    const userIndex = database.findIndex((user)=>user.id == userId);
    if(userIndex === -1){
        return res.status(404).json({message:"User tidak ditemukan"});
    }

    const updateUser = {
        ...database[userIndex],
        ...updateData
    }
    database[userIndex] = updateUser;
    return res.json({message:"Data user berhasil diupdate", user:updateUser})
  }


  static async removeUser(req,res) {
    const userId = parseInt(req.params.id, 10);

    const userIndex = database.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    database.splice(userIndex, 1);

    return res.json({ message: "Data user berhasil dihapus" });
  }

  static async getUserData(req, res) {
    const user = req.user;
    return res.json({ user });
  }

  static async addUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userData = req.body;
    const newUser = {
      ...userData,
      id: nextId++,
    };
    database.push(newUser);
    res.send(
      `User berhasil ditambahkan: ${JSON.stringify(
        filterSensitiveInfo(newUser)
      )}`
    );
  }
}

module.exports = UserController;
