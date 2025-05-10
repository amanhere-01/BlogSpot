const express = require('express');
const { handleAddBlog, handleBlogView, handleAddComment } = require('../controllers/blog');
const multer  = require('multer')
const path = require('path');

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

router.post('/comment/:blogId', handleAddComment);

module.exports = router;


