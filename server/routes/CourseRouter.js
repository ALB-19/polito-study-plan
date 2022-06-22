"use strict";
const express = require("express");
const router = express.Router();
const CourseModel = require('../models/CourseModel');


//GET /courses/all
router.get("/all", (req, res) => {
    CourseModel.getAll()
        .then((data) => {
            res.status(data.status).json(data.courses);
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
});




module.exports = router;




