const { QueryTypes } = require("sequelize");
const db = require("../Model/index");
const moment = require('moment');
const Blog = db.blog;
// const User = db.user;
const Comment = db.comment;

exports.blog = async (req, res) => {
    const message = req.flash("success");
    // const blogs = await db.blog.findAll({include:[
    //     {
    //     model: User
    //     }
    //   ]
    // }
    // );

    const blogs =await db.sequelize.query(
      "SELECT blogs.id,blogs.title,blogs.description,blogs.image,blogs.createdAt,users.name FROM blogs JOIN users ON blogs.userId=users.id",
      {
        type: QueryTypes.SELECT,
      }
    );
    // console.log(blogs)
    res.render("blog", { blogs, success: message, moment: moment, activePage: 'blogs', user:req.user});
};

  
//render created blog
exports.renderCreateBlog = async (req, res) => {
  res.render("createblog", { success: req.flash("success"), activePage: "createblog", user:req.user });
};


//C-->Create
exports.createBlog = async (req, res) => {
  const { title, description } = req.body;

  const blog = await db.blog.create({
    title: title,
    description: description,
    image: "http://localhost:4000/" + req.file.filename,
    userId: req.user.id, // passing the user id
  });

  req.flash("success", "Blog created successfully!");
  res.redirect("/blog");
};


// R--> Read the blog by the current user
exports.showMyBlogs = async (req, res) => {
    const myBlogs = await db.blog.findAll({
      where: {
        userId: req.user.id,
      },
    });
    res.render("myblogs", { myBlogs, success: req.flash("success"), moment: moment , activePage: "myBlogs", user: req.user });
};
  

//  Single Blog of the user
exports.singleBlog = async (req, res) => {
  const blog = await Blog.findAll({
    where: {
      id: req.params.id,
    },
  });
  res.render("singleblog", { blog: blog[0], moment: moment});
};


//U--> Update the Blog
exports.editBlog = async (req, res) => {
  const blog = await Blog.findAll({
    where: {
      id: req.params.id,
    },
  });
  res.render("editblog", { blog: blog[0] , success: req.flash("success") });
};


exports.updateBlog = async (req, res) => {
  let updateData = {
    title: req.body.title,
    description: req.body.description,
  };

  if (req.file) {
    const image = "http://localhost:4000/" + req.file.filename;
    updateData.image = image;
  }

  const blog = await Blog.update(updateData, {
    where: {
      id: req.params.id,
    },
  });

  req.flash("success", "Blog updated successfully!");
  res.redirect("/myblogs");
};


// D--> Delete the Blog
exports.deleteBlog = async (req, res) => {
  const blog = await Blog.destroy({
    where: {
      id: req.params.id,
    },
  });

  req.flash("success", "Blog deleted successfully!");
  res.redirect("/myblogs");
};


//for each blogs posted by any user
// exports.eachBlog = async (req, res) => {
//   const blog = await Blog.findAll({ 
//     where: {
//       id: req.params.id,
//     },
//   });
//   res.render("eachblog", {blog: blog[0], moment: moment});
// };

// exports.eachBlog = async (req, res) => {
//   console.log(req.params.blogId)
  // const [blog] = await db.sequelize.query(`SELECT * FROM blogs JOIN users ON blogs.userId=users.id where blogs.id=? `, 
  //     { type: QueryTypes.SELECT,
  //       replacements:[req.params.blogId]
  //     }
  //     );
//   res.render("eachblog", {blog: blog, moment: moment});
// };

//for comments and sinle blog from the main page
exports.eachBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    // Query to fetch the single blog along with the details of the blog writer
    const [blog] = await db.sequelize.query(
      'SELECT blogs.id, blogs.title, blogs.description, blogs.createdAt, blogs.image, users.name FROM blogs JOIN users ON blogs.userId = users.id WHERE blogs.id = ?',
      {
        type: QueryTypes.SELECT,
        replacements: [blogId],
      }
    );

    // Query to fetch the details of comments that are to be passed while rendering the single blog
    const comments = await db.sequelize.query(
      'SELECT comments.id, comments.comment, comments.createdAt, users.name, users.image FROM comments JOIN users ON comments.userId = users.id WHERE blogId = ? ORDER BY comments.createdAt DESC',
      {
        type: QueryTypes.SELECT,
        replacements: [blogId],
      }
    );

    // Query to count the comments
    const [commentCount] = await db.sequelize.query(
      'SELECT COUNT(comments.id) AS commentCount FROM comments WHERE blogId = ?',
      {
        type: QueryTypes.SELECT,
        replacements: [blogId],
      }
    );

    res.render('eachblog.ejs', { blog, comments, count: commentCount, moment });
  } catch (error) {
    console.error(error);
    // Handle other errors
    res.status(500).send('Internal Server Error');
  }
};
