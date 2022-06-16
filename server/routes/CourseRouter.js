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


/* //GET /courses/studyplan

router.get("/studyplan" ,withAuth, (req, res) => {
    CourseModel.getStudyPlan(req.user.id)
        .then((data) => {
            console.log(data.plan)
            res.status(data.status).json(data.plan);
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
});
 */

/* //GET /courses/type
router.get("/type",withAuth, (req, res) => {
    CourseModel.getType()
        .then((data) => {
            res.status(data.status).json(data.type);
        }).catch((error) => {
            res.status(error.status).json(error.message);
        })
}); */


/* //POST /study-plan 
router.post("/studyplan", [
    check('courses').isArray({min:2}).not().optional(),
    check('ID_Type').isInt({min:1, max:2}),
    check('Crediti').if(check('ID_Type').equals('1')).isInt({min:60, max:80}),
    check('Crediti').if(check('ID_Type').equals('2')).isInt({min:20, max:40})
], withAuth,(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({ message: "Validation error", errors: errors.array() });
    CourseModel.addCourses(req.body.courses)
    .then((ID_List) => {
        CourseModel.addStudyPlan(ID_List, req.body.ID_Type, req.user.id, req.body.Crediti)
        .then((data)=>{
            res.status(data.status).end();
        })
        .catch((error) => {
            res.status(error.status).json(error.message);
        })
    }).catch((error) => {
        res.status(error.status).json(error.message);
    })

}); */


/* //DELETE /studyplan

router.delete("/studyplan/:id", withAuth, (req, res) => {

    CourseModel.getListId(req.params.id)
    .then((id_list)=>{
        CourseModel.deleteCourses(id_list)
            .then(() => {
                CourseModel.deleteStudyPlan(req.user.id)
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

   

}); */



module.exports = router;




