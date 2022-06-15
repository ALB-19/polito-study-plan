import { useState } from "react";
import { AuthContext } from "../contexts/AuthContext"
import { useContext } from "react";
import { Button } from "react-bootstrap";

import Course from "../components/Course";
import useNotification from "../hooks/useNotification";
import api from "../services/api";

const EditPlan = (props) => {
    const [session, , setDirty] = useContext(AuthContext);
    const [planCourses, setPlanCourses] = useState(session.plan.courses);
    const [credits, setCredits] = useState(session.plan.Crediti);
    const notify = useNotification();

    const addIntoStudyPlan = (course) => {
        // Propedeuticità
        if (course.Propedeuticità.Code && !planCourses.includes(course.Propedeuticità.Code))
            notify.error(`Problema di propedeuticità con ${course.Propedeuticità.Code} ${course.Propedeuticità.Name}`)
        // Incompatibilità
        else if (course.incompatibilita && course.incompatibilita.find(incompCourse => planCourses.includes(incompCourse.Code)))
            notify.error(`Problema di incompatibilità. Controlla piano di studio`)
        // Limite massimo di studenti
        else if (course.Max_Studenti && course.Iscritti >= course.Max_Studenti)
            notify.error(`Numero massimo di iscritti già raggiunto.`)
        else {
            setPlanCourses((old) => [...old, course.Code]);
            setCredits((old) => old + course.CFU)
        }
    }

    const removeFromStudyPlan = (course) => {
        setPlanCourses((old) => old.filter(c => c !== course.Code));
        setCredits((old) => old - course.CFU)
    }

    const handleReset = () =>{
        setPlanCourses(session.plan.courses);
        setCredits(session.plan.Crediti);
    }

    const handleSave = () => {
        if(credits > session.plan.type.Max_Credits){
            notify.error("Limite massimo di crediti non rispettato")
        }
        else if( credits < session.plan.type.Min_Credits){
            notify.error("Limite minimo di crediti non rispettato")
        }
        else if (session.plan.id){
            // update
        }
        else { //uso planCourse perchè è la lista di corsi aggiornata che poi inserirò in db 
            api.createStudyPlan(planCourses, session.plan.type.ID, credits)
            .then(()=>{
                notify.success('Piano di studio salvato correttamente!');
                setDirty(true);
            })
            .catch((error)=>{
                notify.error(error.message);
            })
        }

    }

    return (
        <div>
            <div className="d-flex justify-content-between mt-2">
                <h4>Crediti attuali: {credits}</h4>
               <div>
                  <Button variant="secondary" className="mx-2" onClick={handleSave}>
                    Salva
                </Button>
                <Button variant="secondary" className="mx-2" onClick={handleReset} >
                    Reset
                </Button>
               </div>
            </div>
            <Course removeList remove={removeFromStudyPlan} course={
                props.course.filter(c => planCourses.includes(c.Code))
            } />
            <Course addList add={addIntoStudyPlan} course={
                props.course.filter(c => !planCourses.includes(c.Code))
            } />
        </div>
    )
}

export default EditPlan;