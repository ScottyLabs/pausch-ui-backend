const mongoose = require("mongoose")

const submissionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    frame_rate: {
      type: Number,
      required: true,
    },
    img_url: String,
    soundtrack_url: String,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    },
    versionKey: false
  }
)

module.exports = mongoose.model("Submission", submissionSchema)
