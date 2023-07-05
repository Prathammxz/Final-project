const db = require("../Model/index");
const Blog = db.blog;

exports.blog = async (req, res) => {
    const blogs = await db.blog.findAll();
    console.log(blogs);
    res.render("blog", {blogs});
};

exports.renderCreateBlog= async (req,res)=>{
    res.render("createblog");
}

exports.createBlog = async (req, res) => {
    const {
        title,
        description
    } = req.body

    const Blog = await db.blog.create({
        title: title,
        description: description,
        image: "http://localhost:4000/" + req.file.filename,
    });

    res.redirect("/blog");
};


