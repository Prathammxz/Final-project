const jwt=require("jsonwebtoken")
const{promisify}=require("util")

exports.isAuthenticated=async (req,res)=>{
    const token=req.cookies.token
    console.log(token)
    const decoded=await promisify(jwt.verify)(token,process.env.SECRET_KEY)
    console.log(decoded)
}