import jwt from "jsonwebtoken";

export const protectedRoute = (req, res, next) => {
  const token = req.cookies.jwt; // Get the token from the cookies
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded.user.id; // Add the decoded user data to the request object
    next();
  });
};
