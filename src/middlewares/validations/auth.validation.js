const joi=require("joi")
const APIError=require("../../utils/error")

class authValidation{
    constructor(){}
    static register=async (req,res,next)=>{
        try {
            await joi.object({
                name:joi.string().trim().min(3).max(100).required().messages({
                    "string.base":"must be normal string",
                    "string.empty":"name not be blanked",
                    "string.min":"name should be min 3 character",
                    "string.max":"name should be max 100 character",
                    "string.required":"name must be filled"
                }),
                email:joi.string().email().trim().min(3).max(100).required().messages({
                    "string.base":"must be normal string",
                    "string.empty":"name not be blanked",
                    "string.email":"put correct email address",
                    "string.min":"email should be min 3 character",
                    "string.max":"email should be max 100 character",
                    "string.required":"email must be filled"
                }),
                password:joi.string().trim().min(6).max(36).required().messages({
                    "string.base":"must be normal string",
                    "string.empty":"name not be blanked",
                    "string.min":"password should be min 6 character",
                    "string.max":"password should be max 36 character",
                    "string.required":"name must be filled"
                })
            }).validateAsync(req.body)
        } catch (error) {
            if(error.detail&&error?.details[0].message)
                throw new APIError(error.detail[0].message,400)
            else
                throw new APIError("validation error occured",400)
        }
        next()
    }

    static login=async (req,res,next)=>{
        try {
            await joi.object({
                email:joi.string().email().trim().min(3).max(100).required().messages({
                    "string.base":"must be normal string",
                    "string.empty":"name not be blanked",
                    "string.email":"put correct email address",
                    "string.min":"email should be min 3 character",
                    "string.max":"email should be max 100 character",
                    "string.required":"email must be filled"
                }),
                password:joi.string().trim().min(6).max(36).required().messages({
                    "string.base":"must be normal string",
                    "string.empty":"name not be blanked",
                    "string.min":"password should be min 6 character",
                    "string.max":"password should be max 36 character",
                    "string.required":"name must be filled"
                })
            }).validateAsync(req.body)
        } catch (error) {
            if(error.detail&&error?.details[0].message)
                throw new APIError(error.detail[0].message,400)
            else
                throw new APIError("validation error occured",400)
        }
        next()
    }
}

module.exports=authValidation