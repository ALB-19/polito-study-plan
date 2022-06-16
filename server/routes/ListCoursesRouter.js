"use strict";
const express = require("express");
const router = express.Router();
const CourseModel = require('../models/CourseModel');
const ListCoursesModel = require('../models/ListCoursesModel')
const { check, validationResult } = require('express-validator');

const withAuth = require('../middlewares/withAuth');





module.exports=router;