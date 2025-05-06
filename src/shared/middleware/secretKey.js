const secretKey = async (req, res, next) => {
  try {
    const headersSecretKey = req.headers.secretkey;
    if (headersSecretKey === process.env.API_SECRET_KEY) {
      return next();
    } else {
      return res
        .status(403)
        .json({ status: 403, message: "Forbidden: Invalid secret key" });
    }
  } catch (error) {
    console.error("Error in secretKey middleware:", error);
    res.status(401).json({ status: 401, error: "Unauthorized" });
  }
};

module.exports = secretKey;
