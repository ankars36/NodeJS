require("express-async-errors")
const express = require("express")
const app = express()

require("dotenv").config()
require("./src/db/dbConnection")
const port = process.env.PORT || 5001
const router = require("./src/routers")
const errorHandlerMiddleware = require("./src/middlewares/errorHandler")
const cors = require("cors")
const corsOptions = require("./src/helpers/corsOption")
const mongosanitize = require("cors")
const path = require('path')
const apiLimiter = require("./src/middlewares/rateLimit")
const moment = require("moment-timezone")
moment.tz.setDefault("Europa/Istanbul")

// Middlewares
app.use(express.json())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

app.use(express.static(path.join(__dirname, "public")))
app.use("/uploads", express.static(__dirname))

app.use(cors(corsOptions))

app.use("/api", apiLimiter)

app.use(
    mongosanitize({
        replaceWith: '_',
    }),
);

app.use("/api", router)

app.get("/", (req, res) => {
    res.json({
        message: "Welcome ARZ Api ..."
    })
})

// Error
app.use(errorHandlerMiddleware)

app.listen(port, () => {
    console.log(`Server ${port} working...`);
}) 