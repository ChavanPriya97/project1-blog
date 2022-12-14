const jwt = require("jsonwebtoken")
const blogModel = require("../models/blogModel")
const { isValidId } = require("../validators/validator")


const authentication = async function(req,res,next){
    let token = req.headers["x-api-key"]
    if (!token) return res.status(401).send({ status: false, msg: "token must be present" });

    jwt.verify(token,"project-mini-blogging", (error,decoded) => {
        if(error) { 
            return res.status(401).send({status : false , message : error.message})
        }else {
            req.decoded = decoded
            return next();
        }
    });
}

const authorisation = async function(req,res,next){
    let blogId = req.params.blogId
    let tokenAuthorId = req.decoded.authorId

    if (!isValidId(blogId)) return res.status(400).send({ status: false, msg: "Invalid blogId" });

    let blogs = await blogModel.findOne({_id : blogId})
    if(!blogs) return res.status(404).send({status: false , message : "blog not found"})

    if(tokenAuthorId != blogs.authorId) return res.status(403).send({status : false, message : "unauthorised user"})
    
    return next();
}

module.exports = {authentication,authorisation}