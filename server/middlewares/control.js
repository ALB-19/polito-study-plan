'use strict'

const CourseModel = require("../models/CourseModel");
const ListCoursesModel = require('../models/ListCoursesModel')
const StudyPlanModel = require('../models/StudyPlanModel');

const withControl = (req, res, next) => { //req contiene le stesse cose che contiene le req del router e per questo possiamo fare quello scritto sotto
    CourseModel.getAll()
        .then((data) => {
            if (req.params.id) { //se abbiamo l'id vuol dire che abbiamo fatto la put e quindi stiamo aggiornando 
                StudyPlanModel.getListId(req.params.id)
                    .then((id_list) => {
                        ListCoursesModel.getCourseIDList(id_list) //prendiamo tutti i corsi che ci sono in studyplan prima dell'update
                            .then((planCourses) => {
                                const planCoursesUpdate = data.courses.filter(c => { //(update) array dei corsi dello study plan tenendo conto di tutti gli aggiornameti andati a buon fine (presupponiamo questo)
                                    return (!req.body.oldCourses.includes(c.Code) //togliamo corsi che stanno in delete ovvero quelli che vogliamo eliminare
                                        && (req.body.newCourses.includes(c.Code) //prendiamo quelli che stanno in insert
                                            || planCourses.includes(c.Code))
                                    ) //prendiamo quelli che stanno già in study plan
                                }) //cosi alla fine abbiamo creato l'effettiva lista di corsi che ci interessa (cose se prevedessimo il futuro )
                                //poi andiamo a ritroso facendo i check 
                                let validationError = false; //presupponiamo 0 errori inzialmente

                                planCoursesUpdate.forEach(course => {
                                    if (course.Propedeuticità.Code && !planCoursesUpdate.includes(data.courses.find(c => c.Code === course.Propedeuticità.Code))) {
                                        validationError = true;
                                    }
                                    else if (course.incompatibilita && course.incompatibilita.find(coursInc => planCoursesUpdate.includes(data.courses.find(course => course.Code === coursInc.Code)))) {
                                        validationError = true;
                                    }
                                    else if (course.Max_Studenti && course.Max_Studenti === course.Iscritti) {
                                        validationError = true;
                                    }
                                });

                                if (validationError) {
                                    return res.status(422).json('condizioni non rispettate')
                                }
                                else return next(); //next fa continuare la rotta 

                            })
                            .catch((err) => {
                                return res.status(err.status).json(err.message);
                            })
                    })
                    .catch((err) => {
                        return res.status(err.status).json(err.message);
                    })
            }
            else {

                const planCoursesUpdate = data.courses.filter(c => { //(add) array dei corsi dello study plan da aggiungere presupponendo 0 errori
                    return req.body.courses.includes(c.Code) //qui è una post e quindi prendiamo direttamente l'array dei corsi che si vogliono inserire 
                })

                let validationError = false;

                planCoursesUpdate.forEach(course => {
                    if (course.Propedeuticità.Code && !planCoursesUpdate.includes(data.courses.find(c => c.Code === course.Propedeuticità.Code))) {
                        validationError = true;
                    }
                    else if (course.incompatibilita && course.incompatibilita.find(coursInc => planCoursesUpdate.includes(data.courses.find(course => course.Code === coursInc.Code)))) {
                        validationError = true;
                    }
                    else if (course.Max_Studenti && course.Max_Studenti === course.Iscritti) {
                        validationError = true;
                    }
                });

                if (validationError) {
                    return res.status(422).json('condizioni non rispettate')
                }
                else return next(); //next fa continuare la rotta

            }

        })
        .catch((err) => {
            return res.status(err.status).json(err.message);
        })
}

module.exports = withControl;

