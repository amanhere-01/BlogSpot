const Blog = require("../models/blog");



async function handleAddBlog(req,res){
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageUrl: `${req.file.filename}`
  })

  return res.redirect(`/blog/${blog._id}`);
}

module.exports = {
  handleAddBlog
}