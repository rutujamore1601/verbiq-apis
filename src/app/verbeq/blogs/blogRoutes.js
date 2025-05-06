const express = require("express");
const {
  createBlog,
  getAllBlog,
  getBlogById,
  updateBlogById,
  deleteBlogById,
  blogFilter,
} = require("./blogController");

const router = express.Router();

router.post("/blogFilter", blogFilter);
router.post("/createBlog", createBlog);
router.post("/getAllBlog", getAllBlog);
router.get("/getBlogById/:id", getBlogById);
router.put("/updateBlogById/:id", updateBlogById);
router.delete("/deleteBlogById/:id", deleteBlogById);

module.exports = router;
