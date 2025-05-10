const Blog = require("../models/blog");
const Comment = require("../models/comment");



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

async function handleBlogView(req,res){
  const blog = await Blog.findById(req.params.id).populate("createdBy");  //.populate() will replace createdBy with user data with objectId instead of only objectId
  // console.log(blog)
  const allComments = await Comment.find({blogId: req.params.id})
                                    .populate("createdBy")
                                    .sort({createdAt: -1});
  // console.log(`Commentas: ${allComments}`);

  return res.render('blog', {
    user: req.user,
    blog,
    comments: allComments
  })
}

async function handleAddComment(req,res){
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  })

  return res.redirect(`/blog/${req.params.blogId}`);
}

module.exports = {
  handleAddBlog,
  handleBlogView,
  handleAddComment
}