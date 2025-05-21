const express = require('express');
const { handleAddBlog, handleBlogView, handleAddComment, handleDeleteBlog, handleEditBlog } = require('../controllers/blog');
const multer  = require('multer')
const path = require('path');
const Blog = require('../models/blog');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req,res,cb){
    return cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req,file,cb){
    const fileName = `${Date.now()}-${file.originalname}`
    return cb(null, fileName);
  }
})

const upload = multer({storage});

router.get('/add-new', (req,res) => {
  return res.render('addBlog', {
    user: req.user
  })
})


router.post('/', upload.single('coverImage'), handleAddBlog);

router.get('/:id', handleBlogView);

router.get('/edit/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render('editBlog', {
    user: req.user,
    blog: blog
  })
})

router.post('/edit/:id', upload.single('coverImage'), handleEditBlog)

router.post('/delete/:id', handleDeleteBlog)

router.post('/comment/:blogId', handleAddComment);

module.exports = router;


