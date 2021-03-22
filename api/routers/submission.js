const express = require("express")
const router = express.Router()
const multer = require("multer")
const Drive = require("../services/drive")
const { Readable } = require("stream")
const Submission = require("../models/submissionmodel")

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
router.post("/new", async (req, res) => {
  const { img, title, email, author, frame_rate, soundtrack_url } = req.body
  
  const buffer = Buffer.from(img, "base64")
  const bufferStream = new Readable()
  bufferStream._read = () => {};
  bufferStream.push(buffer);
  bufferStream.push(null);

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
      console.error(err);
      res.status(500).json({
        message: "An error occured while saving to the database"
      })
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Unknown error occured while uploading submission to gallery",
    })
  }
})

module.exports = router
