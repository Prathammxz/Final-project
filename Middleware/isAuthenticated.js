const jwt=require("jsonwebtoken")
const{promisify}=require("util")
const { user } = require("../Model")
const flash = require('connect-flash'); 

exports.isAuthenticated=async (req,res, next)=>{
    const token=req.cookies.token;
    if(!token){
        res.redirect("/")
        return
    }
    const decoded=await promisify(jwt.verify)(token,process.env.SECRET_KEY)

    const loggedInUser = await user.findOne({ where: { id: decoded.id } }); //checcking if the token is matched to the user id's token
    if (!loggedInUser) {
      res.render("/")
      }else{
        req.user = loggedInUser;

        
        if(req.session.flashMessage){
            res.locals.flashMessage=req.session.flashMessage
            req.session.flashMessage=null
        }
        
        next();     //allowing when cookie/token is okay
    }
}