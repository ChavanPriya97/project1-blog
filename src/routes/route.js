const express = require("express");
const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")

/******************************create Author******************************/
router.post("/authors",authorController.createAuthor)

/******************************login Author*******************************/
router.post("/login",authorController.authorLogin)

/*****************************create Blogs********************************/

router.post("/blogs",blogController.createBlog)

/****************************get blogs ***********************************/
router.get("/blogs",blogController.getBlogs)

/************************update blogs ***********************************/
router.put("/blogs/:blogId",blogController.updateBlog)

/************************delete blog by Id ****************************/
router.delete("/blogs/:blogId",blogController.deleteById)

/************************delete By query ****************************/
router.delete("/blogs",blogController.deleteByQuery)


module.exports = router