const jwt = require("jsonwebtoken")
const APIError = require("../utils/error")
const user = require("../app/users/model")

const createToken = async (user, res) => {

    const payload = {
        sub: user._id,
        name: user.name
    }

    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: "HS512",
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    return res.status(201).json({
        success: true,
        token,
        message: "success"
    })
}

const tokenCheck = async (req, res, next) => {

    const headerToken = req.headers.authorization && req.headers.authorization.startsWith("Bearer ")

    if (!headerToken)
        throw new APIError("not authorized", 401)

    const token = req.headers.authorization.split(" ")[1]

    await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {

        if (err)
            throw new APIError("token error", 401)

        const userInfo = await user.findById(decoded.sub).select("_id name email")

        if (!userInfo)
            throw new APIError("user not found", 401)

        req.user = userInfo

        next()
    })
}

const createTemporaryToken = async (userId, email) => {
    
    const payload = {
        sub: userId,
        email
    }

    const token = await jwt.sign(payload, process.env.JWT_TEMPORARY_KEY, {
        algorithm: "HS512",
        expiresIn: process.env.JWT_TEMPORARY_EXPIRES_IN
    })

    return "Bearer " + token
}

const decodedTemporaryToken = async (temporaryToken) => {

    const token = temporaryToken.split(" ")[1]
    let userInfo;

    if (!token)
        throw new APIError("not authorized", 401)

    await jwt.verify(token, process.env.JWT_TEMPORARY_KEY, async (err, decoded) => {

        if (err)
            throw new APIError("token error", 401)

        userInfo = await user.findById(decoded.sub).select("_id name email")
        if (!userInfo)
            throw new APIError("user not found", 401)
    })

       return userInfo
}

module.exports = {
    createToken,
    tokenCheck,
    createTemporaryToken,
    decodedTemporaryToken
}