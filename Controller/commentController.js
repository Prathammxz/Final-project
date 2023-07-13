
const db = require("../Model/index");
const Comment = db.comment;
const Blog = db.blog;

// Add comment to the blogs
exports.addComment = async (req, res) => {
  const { comment } = req.body;

  if (comment && comment.trim() !== "") {
    try {
      await Comment.create({
        comment: comment,
        blogId: req.params.blogId,
        userId: req.user.id,
      });
    } catch (error) {
      console.error(error);
    }
  }

  res.redirect("/eachblog/" + req.params.blogId + "#comments");
};

//to edit the posted comments
exports.editComment = async(req, res)=>{
    const blogId = req.params.blogId;
    const commentId = req.params.commentId;
    const comment = await Comment.findOne({
      where :{
        id: commentId,
      }
    });
      res.render("editcomment" ,{comment: comment,blogId:blogId})
}


exports.updateComment = async(req, res)=>{
  
  const comment = req.body.comment
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;

    await Comment.update(
      {
        comment: comment,
      },{
        where:{
          id: commentId,
        }
      }
    );


    res.redirect("/eachblog/" + req.params.blogId)
}

// delete the comment
// delete the comment
exports.deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  const blogId = req.params.blogId;

  await Comment.destroy({
    where: {
      id: commentId,
    },
  });

  res.redirect("/eachblog/" + blogId);
};


