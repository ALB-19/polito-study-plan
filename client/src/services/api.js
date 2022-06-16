import axios from "axios";

const api = {
    getAllCourse: () => {
        return new Promise((resolve, reject) => {
            axios.get(`/api/courses/all`)
                .then(res => resolve(res.data))
                .catch(err => reject({ data: err.response.data, status: err.status }));

        })

    },
    
    getStudyPlan:() => {
        return new Promise((resolve, reject) => {
            axios.get(`/api/study-plan`)
                .then(res => resolve(res.data))
                .catch(err => reject({ data: err.response.data, status: err.response.status }));

        })
    },


    login: (credentials) => {
        return new Promise((resolve, reject) => {
            axios.post('/api/sessions', credentials, { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject(err.response.data));
        })
    },

    logout: () => {
        return new Promise((resolve, reject) => {
            axios.delete('/api/sessions/current',)
                .then(() => resolve())
                .catch((err) => reject(err.response.data));
        })
    },

    getUserInfo: () => {
        return new Promise((resolve, reject) => {
            axios.get('/api/sessions/current')
                .then((res) => resolve(res.data))
                .catch((err) => reject(err.response.data));
        })
    },

    getType: ()=>{
        return new Promise((resolve, reject) => {
            axios.get('/api/study-plan/type')
                .then((res) => resolve(res.data))
                .catch((err) => reject(err.response.data));
        })
    },

    createStudyPlan: (courses,ID_Type, Crediti)=>{
        return new Promise((resolve, reject) => {
            axios.post('/api/study-plan/add', {courses, ID_Type, Crediti})
                .then((res) => resolve(res.data))
                .catch((err) => reject(err.response.data));
        })
    },

    updateStudyPlan: (ID, Crediti, oldCourses, newCourses) =>{
        return new Promise((resolve, reject) => {
            axios.put(`/api/study-plan/${ID}`, {oldCourses, newCourses, Crediti })
            .then((res) => resolve(res.data))
            .catch((err) => reject(err.response.data));
        })
    },

    deleteStudyPlan: (id_studyplan) => {
        return new Promise((resolve, reject) => {
            axios.delete(`/api/study-plan/${id_studyplan}`)
                .then(() => resolve())
                .catch(err => reject(err.response.data));
        })
    }



}
export default api;
