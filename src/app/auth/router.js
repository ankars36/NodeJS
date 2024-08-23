const router = require("express").Router()
const { login, register, forgotPassword, resetCodeCheck, resetPassword } = require("./controller")
const authValidation = require("../../middlewares/validations/auth.validation")

router.post("/login", authValidation.login, login)

router.post("/register", authValidation.register, register)

router.post("/forgot-password", forgotPassword)

router.post("/reset-code-check", resetCodeCheck)

router.post("/reset-password", resetPassword)

module.exports = router