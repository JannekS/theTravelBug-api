const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    err.statusCode = 401;
    if (err.name === "JsonWebTokenError") {
      err.message = "Invalid Token.";
    }
    if (err.name === "TokenExpiredError") {
      err.message = "You have been logged out automatically.";
    }
    next(err);
  }
};
