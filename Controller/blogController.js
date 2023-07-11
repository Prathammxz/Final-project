const { QueryTypes } = require("sequelize");
const db = require("../Model/index");
const moment = require('moment');
const Blog = db.blog;
const User = db.user;

exports.blog = async (req, res) => {
    const message = req.flash("success");
    // const blogs = await db.blog.findAll({include:[
    //     {
    //     model: User
    //     }
    //   ]
    // }
    // );

    const blogs = await db.sequelize.query(`SELECT blogs.*, users.name AS authorName FROM blogs JOIN users ON blogs.userId = users.id`, 
      { type: QueryTypes.SELECT}
      );

    // console.log(blogs)
    res.render("blog", { blogs, success: message, moment: moment, activePage: 'blogs' });
};

  
//render created blog
exports.renderCreateBlog = async (req, res) => {
  res.render("createblog", { success: req.flash("success"), activePage: "createblog" });
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
    res.render("myblogs", { myBlogs, success: req.flash("success"), moment: moment , activePage: "myBlogs" });
};
  

//  Single Blog of the user
exports.singleBlog = async (req, res) => {
  const blog = await Blog.findAll({
    where: {
      id: req.params.id,
    },
  });
  res.render("singleblog", {blog: blog[0], moment: moment});
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

//Add comment to the blogs
exports.AddComment = async(req, res)=>{

};
