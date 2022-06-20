'use strict';

const db = require('../db/dbmiddleware');

module.exports = {

    addCourses: (courses) => {
        return new Promise((resolve, reject) => {
            const queryLastID = "SELECT max(ID) as lastID FROM LIST_COURSES"
            db.get(queryLastID, [], (err, row) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (row.length === 0) reject({ message: "No rows found for IDs", status: 404 });
                else {
                    const query = "INSERT INTO LIST_COURSES (ID, Code) VALUES (?,?)"
                    const stmt = db.prepare(query);
                    const id = row.lastID + 1;
                    courses.forEach(course => {
                        stmt.run([id, course], function (err) {
                            if (err) reject({ message: err.message, status: 500 });
                        })
                    });
                    resolve(id)
                }
            })
        })
    },


    updateCourses: (id_list, oldCourses, newCourses) => {
        return new Promise((resolve, reject) => {
            const query_delete = "DELETE FROM LIST_COURSES WHERE ID = ? and Code = ?";
            const query_insert = "INSERT INTO LIST_COURSES (ID, Code) VALUES (?, ?)";

            const stmt_delete = db.prepare(query_delete);
            const stmt_insert = db.prepare(query_insert);

            oldCourses.forEach(course => {
                stmt_delete.run([id_list, course], function (err) {
                    if (err) reject({ message: err.message, status: 500 });
                })
            });

            newCourses.forEach(course => {
                stmt_insert.run([id_list, course], function (err) {
                    if (err) reject({ message: err.message, status: 500 });
                })
            });

            resolve();
        })
    },

    getCourseIDList: (id_list) =>{
        return new Promise((resolve, reject) => {
            const query = "SELECT Code FROM LIST_COURSES WHERE ID = ?"
            db.all(query, [id_list], (err, rows) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (rows.lenght === 0) reject({ message: "Non sono state trovati corsi associati a ID_LIST.", status: 404 });
                else resolve(rows.map(row => row.Code));
            })
        })
    },  


    deleteCourses: (id_list) => {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM LIST_COURSES WHERE ID = ?";
            db.run(query, [id_list], function (err) {
                if (err) reject({ message: err.message, status: 500 });
                else resolve({ status: 200 });
            });
        });
    },
}