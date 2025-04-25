// middleware/authMiddleware.js
const admin = require("../firebaseAdmin");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send("Invalid token");
  }
};

module.exports = verifyToken;
