const blogModel = require("./blogModel");

const blogFilter = async (req, res) => {
  const { blogTitle, authorName } = req.body;
  try {
    const filter = {};

    if (blogTitle.length > 0) {
      filter.blogTitle = new RegExp(blogTitle, "i");
    }

    if (authorName.length > 0) {
      filter.authorName = new RegExp(authorName, "i");
    }

    const result = await blogModel.find({ ...filter });

    res.status(200).json({ status: 200, totalRecords: result.length, result });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: error });
  }
};

const createBlog = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Please fill all fields..",
      });
      return;
    }
    const Blog = await blogModel.create({
      ...req.body,
    });
    if (!Blog) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: "Failed to create Blog..",
      });
      return;
    }
    res.status(201).json({
      status: 201,
      error: "201",
      message: "Blog created successfully..",
      data: Blog,
    });
  } catch (error) {
    console.log("error", error);
    // const errorMessage = error.errors.map((err) => err.message).join(" ,");
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      // error: errorMessage,
    });
  }
};

const getAllBlog = async (req, res) => {
  const { search } = req.body; // Destructure 'search' from req.body
  try {
    const filter = {};

    if (search && search.length > 0) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ blogTitle: regex }, { authorName: regex }];
    }

    const data = await blogModel.find(filter);

    res.status(200).json({ status: 200, totalRecords: data.length, data });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const id = req.params.id;
    const Blog = await blogModel.findById(id);

    if (!Blog) {
      res.status(404).json({
        status: 404,
        error: 404,
        message: `Blog of id ${id} is not found`,
      });
      return;
    }
    res.status(200).json({ status: 200, error: 200, data: Blog });
  } catch (error) {
    console.error("Error fetching Blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateBlogById = async (req, res) => {
  try {
    const id = req.params.id;

    const BlogUpdate = await blogModel.findByIdAndUpdate(id, {
      ...req.body,
    });

    if (!BlogUpdate) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to update Blog of ID ${id}.`,
      });
      return;
    }

    res.status(200).json({ status: 200, error: "200", data: BlogUpdate });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};

const deleteBlogById = async (req, res) => {
  try {
    const id = req.params.id;
    const Blog = await blogModel.findByIdAndDelete(id);

    if (!Blog) {
      res.status(400).json({
        status: 400,
        error: "400",
        message: `Failed to delete Blog of ID ${id}...`,
      });
      return;
    }
    res.status(200).json({
      status: 200,
      error: "200",
      message: `Blog of BlogID ${id} is successfully deleted..`,
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
  }
};
module.exports = {
  blogFilter,
  createBlog,
  getAllBlog,
  getBlogById,
  updateBlogById,
  deleteBlogById,
};
