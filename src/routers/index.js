const router = require("express").Router()
const upload = require("../middlewares/lib/upload")
const APIError = require("../utils/error")
const auth = require("../app/auth/router")
const user = require("../app/users/router")

router.use(auth)
router.use(user)

router.post("/upload", function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError)
            throw new APIError("while uploading error occured because of Multer: ", err)
        else if (err)
            throw new APIError("while uploading error occured: ", err)
        else return new Response(req.savedImages, "upload success").success(res)
    })
})

module.exports = router