const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const { isValidId, isEmail, isValidString, isValidPassword } = require("../validators/validator")


const createBlog = async function(req,res){
    try {
        let data = req.body
        let tokenAuthorId = req.decoded.authorId
        const{title,body,authorId,category,tags ,subcategory } = data

        if(Object.keys(data).length == 0) return res.status(400).send({status : false , message : "provide the data in request body"})

        if(!title) return res.status(400).send({status : false , message : "title is required"})
        if(!isValidString(title)) return res.status(400).send({status : false , message : "please provide valid title"})

        if(!body) return res.status(400).send({status : false , message : "body is required"})
        if(!isValidString(body)) return res.status(400).send({status : false , message : "please provide valid body"})
    
        if(!authorId) return res.status(400).send({status : false , message : "authorId is required"})
        if (!isValidId(authorId)) return res.status(400).send({ status: false, msg: "Invalid authorId" });
        
        let findAuthor = await authorModel.findOne({_id : authorId})
        if(!findAuthor) return res.status(404).send({status :false , message : "author not found"})
        if(tokenAuthorId != authorId) return res.status(403).send({status : false, message : "unauthorised user"})
        
        if(!category) return res.status(400).send({status : false , message : "category is required"}) 
        if(!isValidString(category)) return res.status(400).send({status : false , message : "please provide valid category"})

        if(tags){
            if(!isValidString(tags)) return res.status(400).send({status : false , message : "please provide valid tags"})
        }
        if(subcategory){
            if(!isValidString(subcategory)) return res.status(400).send({status : false , message : "please provide valid subcategory"})
        }
        const blog = await blogModel.create(data)
        return res.status(201).send({status: true , message : "blog created successfully", data : blog})
        
    } catch (error) {
        return res.status(500).send({status : false , message : error.message})  
    }
}

const getBlogs = async function(req,res){
    try {
        let queries = req.query
        if(Object.keys(queries).length== 0){
            const blogs = await blogModel.find({isDeleted : false , isPublished:true})
            return res.status(200).send({status : true,message : "blog list", data : blogs})
        }

        const blogs = await blogModel.find({isDeleted : false , isPublished:true,...queries })
        if(blogs.length == 0) return res.status(404).send({status :true , message : "blog not found "})
        return res.status(200).send({status : true ,message : "blog list", data :blogs})

    } catch (error) {
        return res.status(500).send({status:false ,message : error.message})        
    }
}

const updateBlog = async function(req,res){
    try {
        const blogId = req.params.blogId
        const data = req.body
        const{title, body, tags,subcategory} = data

        const blog = await blogModel.findOneAndUpdate(
            {_id : blogId,isDeleted :false },
            {
            title : title , 
            body :body,
            $set : { isPublished : true,publishedAt : new Date(Date.now())},
            $push : {tags :tags , subcategory :subcategory}},
            {new : true}
        )

        if(!blog) return res.status(404).send({status :true , message : "blog not found "})

        return res.status(200).send({status : true , message :  "blog updated successfully",data : blog})

    } catch (error) {
        return res.status(500).send({status:false ,message : error.message})         
    }
    
}

const deleteById = async function(req,res){
    try {
        let blogId = req.params.blogId
        
        const blog = await blogModel.findOneAndUpdate(
            {_id : blogId ,isDeleted : false , isPublished : true },
            {$set :{isDeleted : true,deletedAt : new Date(Date.now())}},
            {new : true}
            )

        if(!blog) return res.status(404).send({status :true , message : "blog not found "})
        
        return res.status(200).send({status : true , message : "blog is Deleted",data : blog})

    } catch (error) {
        return res.status(500).send({status:false ,message : error.message})
    }
}

const deleteByQuery  = async function(req,res){
    try {
        let queries = req.query
        let tokenAuthorId = req.decoded.authorId

        let checkId = await blogModel.find(queries).select({ _id: 0, authorId: 1 });

        if (checkId.length == 0) {
            return res.status(404).send({ status: false, data: "No Blog found" });
            }
        let count = 0;
        for (let i = 0; i < checkId.length; i++) {
            if (checkId[i].authorId == tokenAuthorId) count++;
        }

        if (count == 0) return res.status(404).json({ status: false, message: "Unauthorised author" });
    
        const blogs =  await  blogModel.findOneAndUpdate(
            {isDeleted :false , isPublished : true ,authorId : checkId.authorId},
            {$set :{isDeleted : true,deletedAt : new Date(Date.now())}},
            {new : true}
        )
        
        return res.status(200).send({status :true , message :"blog is deleted",data :blogs})
    } catch (error) {
        return res.status(500).send({status:false ,message : error.message})        
    }
}

module.exports = {createBlog , getBlogs,updateBlog,deleteById,deleteByQuery}