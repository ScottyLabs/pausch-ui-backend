const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({dest: '/uploads/'});


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
router.post('/new', (req, res, next)=>{

    const img_url = "https://google.com";

    const currentTime = (Math.floor(new Date().getTime() / 1000)).toString();


    const submission = new Submission({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        timestamp: currentTime,
        img_url: img_url,
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


});

module.exports = router;