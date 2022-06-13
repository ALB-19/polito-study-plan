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


//GET /courses/studyplan

router.get("/studyplan", (req, res) => {
    console.log(req.id)
    CourseModel.getStudyPlan(req.id)
        .then((data) => {
            res.status(data.status).json(data.courses);
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
});


//GET /courses/type
router.get("/type", (req, res) => {
    CourseModel.getType()
        .then((data) => {
            res.status(data.status).json(data.type);
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
});



module.exports = router;




