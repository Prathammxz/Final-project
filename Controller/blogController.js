const db = require("../Model/index");
const Blog = db.blog;

exports.blog = async (req, res) => {
    const blogs = await db.blog.findAll();
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
        userId: req.user.id             //passing the user id
    });

    res.redirect("/blog");
};

exports.showMyBlogs = async(req, res)=>{
    const myBlogs= await db.blog.findAll({
        where:{
            userId:req.user.id
        }
    })
        res.render("myblogs", {myBlogs: myBlogs})
}


