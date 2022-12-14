const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")
const { isValidId, isEmail, isValidString, isValidPassword } = require("../validators/validator")

const  createAuthor = async function(req,res){
    try {
        let data = req.body
        const {fname,lname,title,email,password} = data

        if(Object.keys(data).length == 0) return res.status(400).send({status :false, message : "provide data inside request body"})
        
        if(!fname) return res.status(400).send({status : false , message : "fname is required"})
        if(!isValidString(fname)) return res.status(400).send({status : false , message : "please provide valid fname"})

        if(!lname) return res.status(400).send({status : false , message : "lname is required"})
        if(!isValidString(lname)) return res.status(400).send({status : false , message : "please provide valid lname"})

        if(!title) return res.status(400).send({status : false , message : "title is required"})
        let titles = ["Mr", "Mrs", "Miss"]
        if(!titles.includes(title)) return res.status(400).send({status : false , message : "please provide valid title from Mr or Mrs or Miss"})

        if(!email) return res.status(400).send({status : false , message : "email is required"})
        if(!isEmail(email)) return res.status(400).send({status : false , message : "please provide valid email"})

        let findEmail = await authorModel.findOne({email : email})
        if(findEmail) return res.status(400).send({status : false ,message : "email must be unique"})

        if(!password) return res.status(400).send({status : false , message : "password is required"})
        if(!isValidPassword(password)) return res.status(400).send({status : false , message : "password must contain upper case, lovercase , number and special character"})
        
        const author = await authorModel.create(data)
        return res.status(201).send({status : true , message : "author created successfully" ,data : author})
        
    } catch (error) {
        return res.status(500).send({status : false , message : error.message})
    }   
}

const authorLogin = async function(req,res){
    try {
        let data = req.body
        const {email,password} = data
        
        if(Object.keys(data).length == 0) return res.status(400).send({status :false, message : "provide data inside request body"})

        if(!email) return res.status(400).send({status : false , message : "email is required"})
        if(!isEmail(email)) return res.status(400).send({status : false , message : "please provide valid email"})

        if(!password) return res.status(400).send({status : false , message : "password is required"})

        const loginAuthor = await authorModel.findOne({email:email,password:password})

        if(!loginAuthor) return res.status(400).send({status : false , message : "password or email not match"})

        let token = jwt.sign(
        {
            authorId : loginAuthor._id 
        },
        "project-mini-blogging",
        {expiresIn : 60*60 }
    )
    return res.status(200).send({status : true , message : "user login successfully",data : token})

    } catch (error) {
        return res.status(500).send({status : false , message : error.message})        
    }
}

module.exports = {createAuthor,authorLogin}