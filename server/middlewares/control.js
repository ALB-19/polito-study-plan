'use strict'

const CourseModel = require("../models/CourseModel");
const ListCoursesModel = require('../models/ListCoursesModel')
const StudyPlanModel = require('../models/StudyPlanModel');

const withControl = (req, res, next) => { 
    CourseModel.getAll()
        .then((data) => {
            if (req.params.id) { //Controllo se esiste l'id. Se true allora si tratta di una put 
                StudyPlanModel.getListId(req.params.id)
                    .then((id_list) => {
                        ListCoursesModel.getCourseIDList(id_list) 
                            .then((planCourses) => {
                                const planCoursesUpdate = data.courses.filter(c => { //Creazione in anticipo dell'array che vorrei se tutto andasse a buon fine.
                                    return (!req.body.oldCourses.includes(c.Code)    //rimozione dei corsi da eliminare
                                        && (req.body.newCourses.includes(c.Code)     //inserimento dei corsi da aggiungere
                                            || planCourses.includes(c.Code))         //mantenimento dei corsi da non rimuovere, già presenti
                                    ) 
                                }) 
                                
                                //ragionamento a ritroso per verificare tutti i vincoli

                                const initialValue = 0;
                                const credits = planCoursesUpdate.reduce((prevValue, currentCourse) => prevValue + currentCourse.CFU, initialValue);

                                let validationError = false; // 0 errori inzialmente
                                
                                planCoursesUpdate.forEach(course => {
                                    // check propedeuticità
                                    if (course.Propedeuticità.Code && !planCoursesUpdate.includes(data.courses.find(c => c.Code === course.Propedeuticità.Code))) {
                                        validationError = true;
                                    }
                                    // check incompatibilità
                                    else if (course.incompatibilita && course.incompatibilita.find(coursInc => planCoursesUpdate.includes(data.courses.find(course => course.Code === coursInc.Code)))) {
                                        validationError = true;
                                    }
                                    // check massimo studenti iscritti
                                    else if (req.body.newCourses.includes(course.Code) && course.Max_Studenti && course.Max_Studenti < course.Iscritti + 1) {
                                        validationError = true;
                                    }
                                    //check crediti passati dal body
                                    else if (credits !== parseInt(req.body.Crediti)) {
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
            else { // condizione iniziale false --> post

                const planCoursesUpdate = data.courses.filter(c => { 
                    return req.body.courses.includes(c.Code) 
                })

                const initialValue = 0;
                const credits = planCoursesUpdate.reduce((prevValue, currentCourse) => prevValue + currentCourse.CFU, initialValue);

                let validationError = false;

                planCoursesUpdate.forEach(course => {
                    // check propedeuticità
                    if (course.Propedeuticità.Code && !planCoursesUpdate.includes(data.courses.find(c => c.Code === course.Propedeuticità.Code))) {
                        validationError = true;
                    }
                    //check incompatibilità
                    else if (course.incompatibilita && course.incompatibilita.find(coursInc => planCoursesUpdate.includes(data.courses.find(course => course.Code === coursInc.Code)))) {
                        validationError = true;
                    }
                    // check massimo studenti iscritti
                    else if (req.body.courses.includes(course.Code) && course.Max_Studenti && course.Max_Studenti < course.Iscritti + 1) {
                        validationError = true;
                    }

                    else if (credits !== parseInt(req.body.Crediti)) {
                        validationError = true;
                        
                    }
                });
                 //check crediti passati dal body
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

