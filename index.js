require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser')
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthentication } = require('./middlewares/auth');
const Blog = require('./models/blog');



const app = express();
const PORT = 8000;

mongoose.connect(process.env.MONGODB_URL)
  .then(console.log('Database connected!'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(checkForAuthentication);
app.use(express.static(path.resolve("./public/uploads")));


app.get('/', async (req,res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render('homepage', {
    user: req.user,
    blogs: allBlogs
  });
})

app.use('/user', userRoute);
app.use('/blog', blogRoute);


app.listen(PORT, () => console.log(`Server started at ${PORT}`));
