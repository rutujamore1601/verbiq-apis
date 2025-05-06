const jwt = require("jsonwebtoken");
const UserModel = require("../../app/verbeq/studentRegistration/studentRegistration.model");

// Secret key to sign the token
const secretKey = process.env.JWT_SECRET_KEY;

// Middleware function for JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Malformed token" });
      } else {
        console.error("Error verifying token:", err);
        return res.status(401).json({ message: "Token is not valid" });
      }
    }

    console.log("Decoded token:", decoded);

    UserModel.findOne(
      { email: decoded.email, deviceRegistrationToken: token },
      (err, user) => {
        if (err) {
          console.error("Error finding user in database:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        if (!user) {
          console.log(
            "Database query result: no user found with given email and token"
          );
          return res
            .status(401)
            .json({
              message:
                "Logged out from this device due to login on another device",
            });
        }

        console.log("User found:", user);
        req.user = user;
        next();
      }
    );
  });
};

module.exports = authenticateToken;
