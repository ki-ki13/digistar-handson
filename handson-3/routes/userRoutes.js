const express = require("express");
const UserController = require("../controllers/userController");
const { validateAddUser, userLogin, authorizeUpdate } = require("../middlewares/userValidator");

const router = express.Router();

router.get("/",userLogin,UserController.getAllUsers);
router.get("/:id",userLogin, UserController.getUserData);
router.post("/", validateAddUser,UserController.addUser);
router.put("/:id",userLogin, authorizeUpdate, UserController.updateUser);
router.delete("/:id",userLogin, UserController.removeUser);

module.exports = router;