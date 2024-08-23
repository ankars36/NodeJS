const user = require("../users/model")
const bcrypt = require("bcrypt")
const APIError = require("../../utils/error")
const { createToken, createTemporaryToken, decodedTemporaryToken } = require("../../middlewares/auth")
const crypto = require("crypto")
const moment = require("moment")
const sendEmail = require("../../utils/sendMail")
const Response = require("../../utils/response")

const login = async (req, res) => {
    const { email, password } = req.body

    const userInfo = await user.findOne({ email })

    if (!userInfo)
        throw new APIError("User not found! email or password is wrong", 401)

    const comparePassword = await bcrypt.compare(password, userInfo.password)

    if (!comparePassword)
        throw new APIError("User not found! email or password is wrong", 401)

    createToken(userInfo, res)

    return res
}

const register = async (req, res) => {
    try {
        const { email } = req.body

        const userCheck = await user.findOne({ email })

        if (userCheck)
            throw new APIError("User already registered!", 401)


        req.body.password = await bcrypt.hash(req.body.password, 10)


        console.log("hash password: ", req.body.password)

        const userSave = new user(req.body)


        // return res.status(201).json({
        //     success: true,
        //     data: userSave,
        //     message: "Successfuly registered..."
        // })

        await userSave.save()
            .then((response) => {
                return res.status(201).json({
                    success: true,
                    data: response,
                    message: "Successfuly registered..."
                })
            })


    } catch (error) {
        throw new APIError(error, 401)
    }
}



const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const userInfo = await user.findOne({ email }).select("_id name email")
   
    if (!userInfo)
        return new APIError("user not found", 400)

    const resetCode = crypto.randomBytes(3).toString("hex")

    console.log("resetCode: ", resetCode)

    // await sendEmail({
    //     from: "base.api.proje@outlook.com",
    //     to: userInfo.email,
    //     subject: "Reset Password",
    //     text: `Reset Code: ${resetCode}`
    // })

    await user.updateOne(
        { email },
        {
            reset: {
                code: resetCode,
                time: moment(new Date()).add(15, "minute").format("YYYY-MM-DD HH:mm:ss")
            }
        }
    )

    return new Response(true, "Check your inbox").success(res)
}

const resetCodeCheck = async (req, res) => {
    const { email, code } = req.body

    const userInfo = await user.findOne({ email }).select("_id name email reset")
    if (!userInfo)
        return new APIError("user not found", 401)

    const dbTime = moment(userInfo.reset.time)
    const nowTime = moment(new Date())

    const timeDiff = dbTime.diff(nowTime, "minutes")

    if (timeDiff <= 0 || userInfo.reset.code !== code)
        throw new APIError("code not found", 401)

    const temporaryToken = await createTemporaryToken(userInfo._id, userInfo.email)

    return new Response({ temporaryToken }, "Change your password").success(res)
}

const resetPassword = async (req, res) => {
    const { password, temporaryToken } = req.body

    const decodedToken = await decodedTemporaryToken(temporaryToken)
    console.log("decodedToken: ", decodedToken)
    const hashPassword = await bcrypt.hash(password, 10)

    console.log("hashPassword: ", hashPassword)

    await user.findByIdAndUpdate(
        {
            _id: decodedToken._id
        },
        {
            reset: {
                code: null,
                time: null
            },
            password: hashPassword
        }
    )

    return new Response(decodedToken, "Change password success").success(res)
}

module.exports = {
    login,
    register,
    forgotPassword,
    resetCodeCheck,
    resetPassword
}