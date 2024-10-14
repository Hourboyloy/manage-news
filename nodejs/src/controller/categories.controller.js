const newsmodel = require("../modeling/news");
const categoriesmodel = require("../modeling/categories");

const Count = async (req, res) => {
  try {
    // Step 1: Get distinct category names from the newsmodel
    const distinctCategories = await newsmodel.distinct("category");

    // Step 2: For each distinct category, check if it exists in categoriesmodel, if not, add it
    const promises = distinctCategories.map(async (category) => {
      const categoryExists = await categoriesmodel.findOne({ name: category });
      if (!categoryExists) {
        // Insert the new category into the categoriesmodel if it doesn't exist
        await categoriesmodel.create({ name: category });
      }
    });

    // Wait for all category checks and inserts to complete
    await Promise.all(promises);

    // Step 3: Return the count of distinct categories
    res.status(200).json({
      message:"count categories successfuly",
      count: distinctCategories.length,
      distinctCategories,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getCategory = async(req,res)=>{
  try {
    const categories = await categoriesmodel.find();
    res.json({ categories: categories, status: 200 });
  } catch (error) {
    console.log(error);
  }
}

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the category already exists
    const categoryExists = await categoriesmodel.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists." });
    }

    // Create the new category
    const newCategory = await categoriesmodel.create({ name });
    res.status(201).json({
      message: "Category created successfully.",
      category: newCategory,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the category by ID
    const deletedCategory = await categoriesmodel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // Get category ID from the request parameters
    const { name } = req.body; // Get the new category name from the request body

    // Step 1: Check if a category with the new name already exists (excluding the current category being updated)
    const existingCategory = await categoriesmodel.findOne({ name });

    // Step 2: If the category name already exists, return an error
    if (existingCategory && existingCategory._id.toString() !== id) {
      return res.status(400).json({ message: "Category name already exists." });
    }

    // Step 3: Find and update the category by ID
    const updatedCategory = await categoriesmodel.findByIdAndUpdate(
      id,
      { name },
      { new: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Step 4: Send success response with the updated category
    res.status(200).json({
      message: "Category updated successfully.",
      category: updatedCategory,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  Count,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
