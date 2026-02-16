const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  // first check request headers has authorization token or not
  const authorization = req.headers.authorization;
  if (!authorization)
    return res.status(401).json({ error: "Token not found!" });

  // Extract the jwt token from the request headers
  const token = authorization.split(" ")[1];
  try {
    // verify the JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // Attach user information to the request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token!" });
  }
};

// Function to generate JWT token
const generateToken = (userData) => {
  return jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: 3000 });
};

module.exports = { jwtAuthMiddleware, generateToken };
