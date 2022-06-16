'use strict';

const db = require('../db/dbmiddleware');

module.exports = {

    getStudyPlan: (id) => {
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
    },

    getType: () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM TYPE_STUDY_PLAN"
            db.all(query, [], (err, rows) => {
                if (err) reject({ message: err.message, status: 500 });
                else if (rows.length === 0) reject({ message: "Non ci sono tipi", status: 404 });
                else resolve({ type: rows, status: 200 });
            })
        })
    },

    addStudyPlan: (id_list, id_type, id_user, crediti) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO STUDY_PLAN (ID_List, ID_Type, ID_User, Crediti) VALUES (?,?,?,?)"
            db.run(query, [id_list, id_type, id_user, crediti], function (err) {
                if (err) reject({ message: err.message, status: 500 });
                else resolve({ status: 200 });

            })
        })
    },

    updateStudyPlan : (id,id_user,newCredit) =>{
        return new Promise((resolve, reject) => {
        const query="UPDATE STUDY_PLAN SET Crediti = ? WHERE ID=? AND ID_User = ?"
        db.run(query, [newCredit,id,id_user], function (err) {
            if (err) reject({ message: err.message, status: 500 });
            else resolve({status:200});
        })
        })
    

    },

    deleteStudyPlan: (id_user) => {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM STUDY_PLAN WHERE ID_User = ?";
            db.run(query, [id_user], function (err) {
                if (err) reject({ message: err.message, status: 500 });
                else resolve({ status: 200 });
            });
        });
    },



}