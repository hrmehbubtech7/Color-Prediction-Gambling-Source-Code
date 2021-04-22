const jwt = require("jsonwebtoken");
module.exports =async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //console.log("token received is: ", token);
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    req.userFromToken = decoded;
    if(req.userFromToken._id=='hjh22')
      next();
    else{
      const user=await User.findById(req.userFromToken._id);
        next();
    
    }    
  } catch (err) {
    //console.log("unauth------ ", err);
    return res.status(401).json("unauth");
  }
};
