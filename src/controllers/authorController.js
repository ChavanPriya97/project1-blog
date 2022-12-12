const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")

const  createAuthor = async function(req,res){
    try {
        let data = req.body
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

        const loginAuthor = await authorModel.find({email:email,password:password})

        let token = jwt.sign(
        {
            id : loginAuthor._id,
            project : "blogging project"
        },
        "project-mini-blogging",
        {expiresIn : 60*60 }
    )

    return res.status(200).send({status : true , message : " user login successfully",data : token})
        
    } catch (error) {
        return res.status(500).send({status : false , message : error.message})        
    }
}

module.exports = {createAuthor,authorLogin}