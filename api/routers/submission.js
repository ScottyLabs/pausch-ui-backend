const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
var Drive = require("../services/drive");


const upload = multer();

const Submission = require('../models/submissionmodel');



//Get submissions end point
router.get('/', (req, res, next)=>{
    Submission.find(req.body).sort('timestamp')
        .then(results=>{
            res.status(200).json(results);
        })
        .catch(err=> {
            res.status(500).json({
                message: "Unknown error occurred.",
                error: err
            });
        });

});


//Post submissions end point
router.post('/new', upload.single('img'), (req, res, next)=>{


    // uploadFile(req.file.originalname, req.file.mimetype, req.file.buffer);

    let stream = require('stream');
    let fileObject = req.file;
    let bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);

    Drive.sendImgToDrive(`${req.body.title}_${req.body.email}_${req.body.frame_rate}.png`, bufferStream, driveCB, req, res);




});

function driveCB(req, res, fileId, err){
    if (err) {
        res.status(500).json({
            message: "Unknown error when uploading to Google Drive.",
            error: err
        });
    }else{
        const currentTime = (Math.floor(new Date().getTime() / 1000)).toString();
        console.log(req.file);

        const submission = new Submission({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            email: req.body.email,
            timestamp: currentTime,
            img_url: 'https://drive.google.com/uc?id='+fileId,
            author: req.body.author,
            soundtrack_url: req.body.soundtrack_url,
            frame_rate: req.body.frame_rate
        });

        submission.save()
            .then(result =>{
                res.status(200).json({
                    message: "Submission Successful!",
                    checkinInfo:submission
                });
            })
            .catch(err=>{
                res.status(500).json({
                    message: "Unknown error occurred while saving this submission",
                    error: err
                });
            });
    }
}

module.exports = router;