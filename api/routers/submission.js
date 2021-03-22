const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const multer = require("multer")
const Drive = require("../services/drive")
const stream = require("stream")
const Submission = require("../models/submissionmodel")

const upload = multer()

//Get submissions end point
router.get("/", (req, res, next) => {
  Submission.find(req.body)
    .sort("timestamp")
    .then((results) => {
      res.status(200).json(results)
    })
    .catch((err) => {
      res.status(500).json({
        message: "Unknown error occurred.",
        error: err,
      })
    })
})

//Post submissions end point
router.post("/new", upload.single("img"), async (req, res) => {
  let fileObject = req.file
  let bufferStream = new stream.PassThrough()
  bufferStream.end(fileObject.buffer)

  const { title, email, author, frame_rate, soundtrack_url } = req.body
  const imgName = `${title}_${email}_${frame_rate}.png`

  try {
    const file = await Drive.sendImgToDrive(imgName, bufferStream)
    const img_url = "https://drive.google.com/uc?id=" + file.id
    const submission = new Submission({
      title,
      email,
      author,
      frame_rate,
      img_url,
      soundtrack_url
    })
    try {
      await submission.save();
      res.json(submission);
    } catch (err) {
      res.status(500).json({
        message: "An error occured while saving to the database"
      })
    }
  } catch (err) {
    res.status(500).json({
      message: "Unknown error occured while uploading submission to gallery",
    })
  }
})

module.exports = router
