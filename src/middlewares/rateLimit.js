const rateLimit = require("express-rate-limit")

const allowedList = ["::1"]

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req, res) => {
        if (req.url == "/login" || req.url == "/register") return 5
        else return 100
    },
    message: {
        success: false,
        message: "too much request"
    },
    skip: (req, res) => allowedList.includes(req.ip),
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

module.exports = apiLimiter