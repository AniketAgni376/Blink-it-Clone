const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

// Joi validation function
function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(category);
}

const categoryModel = mongoose.model("categoryModel", categorySchema);

module.exports = { categoryModel, validateCategory };
