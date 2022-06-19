'use strict'

const db = require('../db/dbmiddleware');
const CourseModel = require("../models/CourseModel");
const ListCoursesModel = require('../models/ListCoursesModel')

const withProp = (req, res, next) => {
ListCoursesModel.getListId(req.body.id_list)
.then((course)=>{

})
.catch(()=>{

})
}

module.exports= withControl; 

