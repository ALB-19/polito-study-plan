"use strict";
const express = require("express");
const router = express.Router();
const StudyPlanModel = require('../models/StudyPlanModel');
const ListCoursesModel = require('../models/ListCoursesModel')
const { check, validationResult } = require('express-validator');

const withAuth = require('../middlewares/withAuth');
const { response } = require("express");

//GET /study-plan

router.get("/", withAuth, (req, res) => {
    StudyPlanModel.getStudyPlan(req.user.id)
        .then((data) => {
            console.log(data.plan)
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
    check('courses').isArray({ min: 2 }).not().optional(),
    check('ID_Type').isInt({ min: 1, max: 2 }),
    check('Crediti').if(check('ID_Type').equals('1')).isInt({ min: 60, max: 80 }),
    check('Crediti').if(check('ID_Type').equals('2')).isInt({ min: 20, max: 40 })
], withAuth, (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({ message: "Validation error", errors: errors.array() });
    ListCoursesModel.addCourses(req.body.courses)
        .then((ID_List) => {
            StudyPlanModel.addStudyPlan(ID_List, req.body.ID_Type, req.user.id, req.body.Crediti)
                .then((data) => {
                    res.status(data.status).end();
                })
                .catch((error) => {
                    res.status(error.status).json(error.message);
                })
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })

});


//PUT /stuy-plan/:id

router.put("/:id", withAuth, (req, res) => {
    ListCoursesModel.getListId(req.params.id)
        .then((id_list) => {
            ListCoursesModel.updateCourses(id_list, req.body.oldCourses, req.body.newCourses)
                .then(() => {
                    StudyPlanModel.updateStudyPlan(req.params.id, req.user.id, req.body.Crediti)
                        .then((data) => res.status(data.status).end())
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

router.delete("/:id", withAuth, (req, res) => {

    ListCoursesModel.getListId(req.params.id)
        .then((id_list) => {
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



});

module.exports = router;
