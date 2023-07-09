module.exports = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch((err) => {
        return res.render("error",{message: "Something went wrong"});
      });
    };
  };