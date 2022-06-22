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
        const insertCourse = (id_list, course) => {
            return new Promise((resolve, reject) => {
                const query = "INSERT INTO LIST_COURSES (ID, Code) VALUES (?, ?)";
                db.run(query, [id_list, course], (err) => {
                    if (err) reject({ message: err.message, status: 500 });
                    else resolve();
                })
            })
        }

        const removeCourse = (id_list, course) => {
            return new Promise((resolve, reject) => {
                const query = "DELETE FROM LIST_COURSES WHERE ID = ? and Code = ?";
                db.run(query, [id_list, course], (err) => {
                    if (err) reject({ message: err.message, status: 500 });
                    else resolve();
                })
            })
        }

        return Promise.all(newCourses.map(course => {
            return insertCourse(id_list, course);
        }).concat(oldCourses.map(course => {
            return removeCourse(id_list, course);
        })))
    },

    getCourseIDList: (id_list) => {
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