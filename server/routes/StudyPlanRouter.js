"use strict";
const express = require("express");
const router = express.Router();
const StudyPlanModel = require('../models/StudyPlanModel');
const ListCoursesModel = require('../models/ListCoursesModel')
const { check, validationResult } = require('express-validator');

const withAuth = require('../middlewares/withAuth');
const withControl = require('../middlewares/control')
const CourseModel = require("../models/CourseModel");

//GET /study-plan

router.get("/", withAuth, (req, res) => {
    StudyPlanModel.getStudyPlan(req.user.id)
        .then((data) => {
            res.status(data.status).json(data.plan);
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
});


//GET /study-plan/type
router.get("/type", withAuth, (req, res) => {
    StudyPlanModel.getType()
        .then((data) => {
            res.status(data.status).json(data.type);
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
});

//POST /study-plan/add
router.post("/add", [
    check('courses').isArray().exists({ checkNull: true }),
    check('ID_Type').isInt({ min: 1, max: 2 }).exists({ checkFalsy: true }),
    check('Crediti').if(check('ID_Type').equals('1')).isInt({ min: 60, max: 80 }).exists({ checkFalsy: true }),
    check('Crediti').if(check('ID_Type').equals('2')).isInt({ min: 20, max: 40 }).exists({ checkFalsy: true }),
], withAuth, withControl, (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json("Validation error");
    ListCoursesModel.addCourses(req.body.courses)
        .then((ID_List) => {
            StudyPlanModel.addStudyPlan(ID_List, req.body.ID_Type, req.user.id, req.body.Crediti)
                .then(() => {
                    CourseModel.updateIscritti(req.body.courses, [])
                        .then(() => {
                            res.status(200).end();
                        })
                        .catch((error) => {
                            res.status(error.status).json(error.message);
                        })
                })
                .catch((error) => {
                    res.status(error.status).json(error.message);
                })
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })

});


//PUT /stuy-plan/:id

router.put("/:id", [
    check('id').isInt().exists({ checkFalsy: true }),
    check('oldCourses').isArray().exists({ checkNull: true }),
    check('newCourses').isArray().exists({ checkNull: true }),
    check('type').isInt({ min: 1, max: 2 }).exists({ checkFalsy: true }),
    check('Crediti').if(check('type').equals('1')).isInt({ min: 60, max: 80 }).exists({ checkFalsy: true }),
    check('Crediti').if(check('type').equals('2')).isInt({ min: 20, max: 40 }).exists({ checkFalsy: true }),
], withAuth, withControl, (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({ message: "Validation error", errors: errors.array() });
    StudyPlanModel.getListId(req.params.id)
        .then((id_list) => {
            ListCoursesModel.updateCourses(id_list, req.body.oldCourses, req.body.newCourses)
                .then(() => {
                    StudyPlanModel.updateStudyPlan(req.params.id, req.user.id, req.body.Crediti)
                        .then(() => {
                            CourseModel.updateIscritti(req.body.newCourses, req.body.oldCourses)
                                .then(() => {
                                    res.status(200).end();
                                })
                                .catch((error) => {
                                    res.status(error.status).json(error.message);
                                })
                        })
                        .catch((error) => {
                            res.status(error.status).json(error.message);
                        })
                })
                .catch(error => res.status(error.status).json(error.message));
        })
        .catch(error => {
            res.status(error.status).json(error.message);
        })

})




//DELETE /study-plan/:id

router.delete("/:id", [
    check('id').isInt().exists({ checkFalsy: true }),
], withAuth, (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({ message: "Validation error", errors: errors.array() });
    StudyPlanModel.getListId(req.params.id)
        .then((id_list) => {
            ListCoursesModel.getCourseIDList(id_list)
                .then((courses) => {
                    CourseModel.updateIscritti([], courses)
                        .then(() => {
                            ListCoursesModel.deleteCourses(id_list)
                                .then(() => {
                                    StudyPlanModel.deleteStudyPlan(req.user.id)
                                        .then((data) => {
                                            res.status(data.status).end();
                                        })
                                        .catch((error) => {
                                            res.status(error.status).json(error.message);
                                        })
                                })
                                .catch(error => {
                                    res.status(error.status).json(error.message);
                                })
                        })
                        .catch(error => {
                            res.status(error.status).json(error.message);
                        })
                })
                .catch(() => {
                    res.status(error.status).json(error.message);
                })
        })
        .catch(() => {
            res.status(error.status).json(error.message);
        })


});

module.exports = router;
