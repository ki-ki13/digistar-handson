const { body } = require("express-validator");
const { database } = require("../model/database");
const { filterSensitiveInfo } = require("../helper/helper");

const validateAddUser = [
  body("name")
    .isLength({ min: 3, max: 15 })
    .withMessage("Nama minimal 3 karakter maksimal 15 karakter"),
  body("email")
    .isEmail()
    .withMessage("Email tidak valid")
    .custom((val) => {
      const user = database.find((user) => user.email === val);
      if (user) {
        throw new Error("Email sudah ada");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 7, max: 15 })
    .withMessage("Password minimal 7 karakter maksimal 15 karakter"),
  body("linkImgProfile")
    .optional()
    .isURL()
    .withMessage("linkImgProfile harus sebuah URL yang valid"),
];

const userLogin = (req, res, next) => {
    const credentials = req.body;
  
    const validUser = database.find(
      (user) => user.email === credentials.email && user.password === credentials.password
    );
  
    if (validUser) {
      req.user = filterSensitiveInfo(validUser); 
      return next(); 
    } else {
      return res.status(401).json({ success: false, message: "email atau password salah" });
    }
  };

  const authorizeUpdate = (req, res, next) => {
    const userId = req.user.id;
    const requestedId = parseInt(req.params.id, 10);
  
    if (userId === requestedId) {
      return next();
    } else {
      return res.status(403).json({ message: "Update punya sendiri lah" });
    }
  };

module.exports = { validateAddUser, userLogin, authorizeUpdate };
