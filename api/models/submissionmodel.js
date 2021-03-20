const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    email: {type: String, required: true},
    timestamp: {type: String, required: true},
    img_url: {type: String, required: false},
    author: {type: String, required: true},
    soundtrack_url: {type: String, required: false},
    frame_rate: {type: Number, required: true}
});

module.exports = mongoose.model('Submission', submissionSchema);