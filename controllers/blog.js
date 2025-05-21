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
  // console.log(blog);
  // console.log(req.user);
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

async function handleDeleteBlog(req, res){
  try {
    const blog = await Blog.findById(req.params.id);

    await Blog.findByIdAndDelete(req.params.id);
    return res.redirect('/');
    
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
}

async function handleEditBlog(req,res){
  const blogId = req.params.id;
  const { title, body } = req.body;
  try {
    const blog = await Blog.findById(blogId);

    if (!blog.createdBy.equals(req.user._id)) {
      return res.status(403).send('Unauthorized');
    }

    blog.title = title;
    blog.body = body;

    if (req.file) {
      blog.coverImageUrl = req.file.filename;
    }

    await blog.save();
    return res.redirect(`/blog/${blogId}`);

  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }

}

module.exports = {
  handleAddBlog,
  handleBlogView,
  handleAddComment,
  handleDeleteBlog,
  handleEditBlog
}