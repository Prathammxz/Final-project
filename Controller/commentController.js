
//Add comment to the blogs
const db = require("../Model/index");
const Comment = db.comment;

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

  res.redirect("/eachblog/" + req.params.blogId);
};
