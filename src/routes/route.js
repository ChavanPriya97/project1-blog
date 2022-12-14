const express = require("express");
const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")

const {authentication , authorisation} = require("../middlewares/auth")

/******************************create Author******************************/
router.post("/authors",authorController.createAuthor)

/******************************login Author*******************************/
router.post("/login",authorController.authorLogin)

/*****************************create Blogs********************************/
router.post("/blogs",authentication,blogController.createBlog)

/****************************get blogs ***********************************/
router.get("/blogs",authentication,blogController.getBlogs)

/************************update blogs ***********************************/
router.put("/blogs/:blogId",authentication,authorisation,blogController.updateBlog)

/************************delete blog by Id ****************************/
router.delete("/blogs/:blogId",authentication,authorisation,blogController.deleteById)

/************************delete By query ****************************/
router.delete("/blogs",authentication,blogController.deleteByQuery)

module.exports = router