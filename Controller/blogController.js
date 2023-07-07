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

exports.singleBlog = async (req, res) => {
    const blog = await Blog.findAll({
        where: {
            id: req.params.id
        }
    })
    res.render("singleblog", {
        blog: blog[0]
    });
};


exports.editBlog = async(req,res)=>{
    const blog = await Blog.findAll({
        where:{
            id: req.params.id
        }
    })
    res.render("editblog",{ blog:blog[0]}
    )
}

exports.updateBlog = async(req,res)=>{
    let updateData = {
        title: req.body.title,
        description: req.body.description,
    };

    if (req.file){
        const image = "http://localhost:400/" + req.file.filename;
        updateData.image = image;
    }

    const blog = await Blog.update(updateData, {
    where: {
        id: req.params.id,
    },
});

console.log("Blog updated successfully");
res.redirect("/myblogs");
}

exports.deleteBlog = async(req,res)=>{
    const blog = await Blog.destroy({
        where:{
            id: req.params.id
        }
    })
    res.redirect("/myblogs")
}


