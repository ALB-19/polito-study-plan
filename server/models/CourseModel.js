'use strict';

const db = require('../db/dbmiddleware');

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT C.Code, C.Nome, C.CFU, C.Max_Studenti, C.Propedeuticità, C.Iscritti, C1.Nome as Prop_name, C1.Code as Prop_code FROM COURSE as C LEFT JOIN COURSE as C1 ON C.Propedeuticità=C1.Code ORDER BY C.Nome";
            db.all(query, [], (err, rows) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (rows.length === 0) reject({ message: "Non sono stati trovati corsi", status: 404 });
                else {
                    const courses = rows;
                    const query1 = "SELECT C.Code, C1.Nome, I.Incomp_Code FROM COURSE as C LEFT JOIN INCOMPATIBILITY as I , COURSE as C1 ON C.Code = I.Course_Code and C1.Code=I.Incomp_Code "
                    db.all(query1, [], (err, rows) => {
                        if (err) reject({ message: err.message, status: 500 });
                        else if (rows.length === 0) resolve(courses.map(course => ({
                            Code: course.Code,
                            Nome: course.Nome,
                            CFU: course.CFU,
                            Max_Studenti: course.Max_Studenti,
                            Propedeuticità: {
                                Code: course.Prop_code,
                                Name: course.Prop_name
                            },
                            Iscritti: course.Iscritti
                        }))
                        )
                        else {

                            const incompatibilita = rows.map(course => ({
                                code: course.Code,
                                incompatibilita: [
                                    ...rows.filter(c => c.Code === course.Code && course.Incomp_Code).map(c => ({ Code: c.Incomp_Code, Name: c.Nome }))
                                ]
                            }));
                            const res = courses.map(course => ({
                                Code: course.Code,
                                Nome: course.Nome,
                                CFU: course.CFU,
                                Max_Studenti: course.Max_Studenti,
                                Propedeuticità: {
                                    Code: course.Prop_code,
                                    Name: course.Prop_name
                                },
                                Iscritti: course.Iscritti,
                                ...incompatibilita.find(c => c.code === course.Code)
                            }))


                            resolve({ courses: res, status: 200 });
                        }
                    })
                }
            });

        });
    },

    updateIscritti: (newCourses, oldCourses) => {
        const addIscritti = (course) => {
            return new Promise((resolve, reject) => {
                const query = "UPDATE COURSE SET Iscritti = Iscritti + 1 WHERE Code = ?"
                db.run(query, [course], (err) => {
                    if (err) reject({ message: err.message, status: 500 });
                    else resolve();
                })
            })
        }

        const removeIscritti = (course) => {
            return new Promise((resolve, reject) => {
                const query = "UPDATE COURSE SET Iscritti = Iscritti - 1 WHERE Code = ?"
                db.run(query, [course], (err) => {
                    if (err) reject({ message: err.message, status: 500 });
                    else resolve();
                })
            })
        }

        return Promise.all(newCourses.map(course => {
            return addIscritti(course);
        }).concat(oldCourses.map(course => {
            return removeIscritti(course);
        })))
    },

    getPropCourseWithCode: (code) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT Propedeuticità FROM COURSE WHERE Code= ? "
            db.get(query, [code], (err, row) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (!row) reject({ message: "Non c'è un corso associato al codice", status: 404 });
                else resolve(row.Propedeuticità);
            })
        })
    }
}