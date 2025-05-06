const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    blogTitle: { type: String, required: false },
    description: { type: Array, required: false },
    blogImg: { type: String, required: false },
    authorName: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blog", blogSchema);
