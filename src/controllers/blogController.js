const blogModel = require("../models/blogModel")

const createBlog = async function(req,res){
    try {
        let data = req.body
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
            return res.status(200).send({status : true, data : blogs})
            }
        const blogs = await blogModel.find({isDeleted : false , isPublished:true, ...queries })
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
            {_id : blogId,isDeleted :false , isPublished : true },
            {$set : {title : title , body :body},
            $push : {tags :tags , subcategory :subcategory}},
            {new : true}
        )
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

        return res.status(200).send({status : true , message : "blog is Deleted",data : blog})

    } catch (error) {
        return res.status(500).send({status:false ,message : error.message})
    }
}

const deleteByQuery  = async function(req,res){
    try {
        const queries = req.query

        const blogs =  await  blogModel.findOneAndUpdate(
            {isDeleted :false , isPublished : true ,...queries},
            {$set :{isDeleted : true,deletedAt : new Date(Date.now())}},
            {new : true}
        )
        
        return res.status(200).send({status :true , message :"blog is deleted",data :blogs})
    } catch (error) {
        return res.status(500).send({status:false ,message : error.message})        
    }
}

module.exports = {createBlog , getBlogs,updateBlog,deleteById,deleteByQuery}