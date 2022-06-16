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
                        else if (rows.length === 0) reject({ message: "Non sono state trovate incompatibilità", status: 404 });
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

/*     getStudyPlan: (id) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT SP.ID, SP.ID_List, T.Nome, T.Max_Credits, T.Min_Credits, SP.Crediti, LC.Code  FROM STUDY_PLAN SP , LIST_COURSES LC, TYPE_STUDY_PLAN T WHERE SP.ID_User= ? AND SP.ID_List = LC.ID AND SP.ID_Type = T.ID"
            db.all(query, [id], (err, rows) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (rows.length === 0) reject({ message: "L'utente non ha un piano di studio", status: 404 });
                else resolve({
                    plan: {
                        ID: rows[0].ID,
                        ID_List: rows[0].ID_List,
                        Crediti: rows[0].Crediti,
                        type: {
                            Nome: rows[0].Nome,
                            Max_Credits: rows[0].Max_Credits,
                            Min_Credits: rows[0].Min_Credits
                        },
                        courses: rows.map(row => row.Code)
                    }, status: 200
                });
            })
        })
    }, */

/*     getType: () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM TYPE_STUDY_PLAN"
            db.all(query, [], (err, rows) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (rows.length === 0) reject({ message: "Non ci sono tipi", status: 404 });
                else resolve({ type: rows, status: 200 });
            })
        })
    }, */



/*     addCourses: (courses) => {
        return new Promise((resolve, reject) => {
            const queryLastID = "SELECT max(ID) as lastID FROM LIST_COURSES"
            db.get(queryLastID, [], (err, row) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (row.length === 0) reject({ message: "No rows found for IDs", status: 404 });
                else {
                    const query = "INSERT INTO LIST_COURSES (ID, Code) VALUES (?,?)"
                    const stmt = db.prepare(query);
                    courses.forEach(course => {
                        stmt.run([row.lastID + 1, course], function (err) {
                            if (err) reject({ message: err.message, status: 500 });
                        })
                    });
                    resolve(row.lastID + 1)
                }
            })
        })
    }, */


/*     addStudyPlan: (id_list, id_type, id_user, crediti) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO STUDY_PLAN (ID_List, ID_Type, ID_User, Crediti) VALUES (?,?,?,?)"
            db.run(query, [id_list, id_type, id_user, crediti], function (err) {
                if (err) reject({ message: err.message, status: 500 });
                else resolve({ status: 200 });

            })
        })
    }, */

/*     getListId: (id_studyplan) =>{
        return new Promise((resolve, reject) => {
            const query="SELECT ID_List FROM STUDY_PLAN WHERE ID = ?"
            db.get(query, [id_studyplan], (err,row) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (!row) reject({ message: "Non sono state trovate liste associate.", status: 404 });
                else resolve (row.ID_List);
            })
        })
    }, */

/*     deleteCourses: (id_list) => {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM LIST_COURSES WHERE ID = ?";
            db.run(query, [id_list], function (err) {
                if (err) reject({ message: err.message, status: 500 });
                else resolve({ status: 200 });
            });
        });
    }, */

/*     deleteStudyPlan: (id_user) => {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM STUDY_PLAN WHERE ID_User = ?";
            db.run(query, [id_user], function (err) {
                if (err) reject({ message: err.message, status: 500 });
                else resolve({ status: 200 });
            });
        });
    },
 */




}