import { useState, useContext } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext"

import Course from "../components/Course";
import useNotification from "../hooks/useNotification";
import useModal from '../hooks/useModal';
import ConfirmationModal from '../components/ConfirmationModal';

import api from "../services/api";

const EditPlan = (props) => {
    const [session, , setDirty] = useContext(AuthContext);
    const navigate = useNavigate();
    const notify = useNotification();
    const [planCourses, setPlanCourses] = useState(session.plan ? session.plan.courses : null);
    const [credits, setCredits] = useState(session.plan ? session.plan.Crediti : null);

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
        const propCourse = props.course.find(c => c.Propedeuticità && c.Propedeuticità.Code === course.Code);
        if (propCourse && planCourses.includes(propCourse.Code)) {
            setPlanCourses((old) => old.filter(c => c !== propCourse.Code));
            setCredits((old) => old - propCourse.CFU)
            notify.success(`Rimosso anche ${propCourse.Nome} per questioni di propedeuticità`);
        }
        setPlanCourses((old) => old.filter(c => c !== course.Code));
        setCredits((old) => old - course.CFU)


    }

    const handleReset = () => {
        setPlanCourses(session.plan.courses);
        setCredits(session.plan.Crediti);
    }

    const [modal, setModal] = useModal(() => {
        if (credits > session.plan.type.Max_Credits) {
            notify.error(`Limite non rispettato. Un piano di studio ${session.plan.type.Nome} deve avere al massimo ${session.plan.type.Min_Credits} crediti.`)
        }
        else if (credits < session.plan.type.Min_Credits) {
            notify.error(`Limite non rispettato. Un piano di studio ${session.plan.type.Nome} deve avere almeno ${session.plan.type.Min_Credits} crediti.`)
        }
        else if (session.plan.ID) {
            const oldCourses = session.plan.courses.filter(c => !planCourses.includes(c));
            const newCourses = planCourses.filter(c => !session.plan.courses.includes(c));

            api.updateStudyPlan(session.plan.ID, credits, oldCourses, newCourses)
                .then(() => {
                    notify.success('Piano di studio aggiornato correttamente!');
                    setDirty(true);
                    navigate('/studyPlan', { replace: true })
                })
                .catch((error) => {
                    notify.error(error.message);
                })
        }
        else { //uso planCourse perchè è la lista di corsi aggiornata che poi inserirò in db 
            api.createStudyPlan(planCourses, session.plan.type.ID, credits)
                .then(() => {
                    notify.success('Piano di studio salvato correttamente!');
                    setDirty(true);
                    navigate('/studyPlan', { replace: true })
                })
                .catch((error) => {
                    notify.error(error.message);
                })
        }

    })



    if (session.plan)
        return (
            <div>
                <ConfirmationModal show={modal} onHide={setModal.onHide} onConfirm={setModal.onConfirm} title="Sei sicuro di salvare il tuo piano studio? " />
                <div className="d-flex justify-content-between mt-2">
                    <div className="d-flex flex-column">
                        <h4>Crediti attuali: {credits}</h4>
                        <div>
                            <h6>Minimo di crediti da aggiungere: {session.plan.type.Min_Credits}</h6>
                            <h6>Massimo di crediti da aggiungere: {session.plan.type.Max_Credits}</h6>
                        </div>
                    </div>
                    <div>
                        <Button variant="secondary" className="mx-2" onClick={setModal.onShow}>
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
                    props.course.filter(c => !planCourses.includes(c.Code)).map(c => ({
                        ...c,
                        disable: (c.Propedeuticità.Code && !planCourses.includes(c.Propedeuticità.Code)) ||
                            (c.incompatibilita && c.incompatibilita.find(incompCourse => planCourses.includes(incompCourse.Code))) ||
                            (c.Max_Studenti && c.Iscritti >= c.Max_Studenti)
                    }))
                } />
            </div>
        )
    else {
        return (
            <Navigate to='/studyPlan' replace />


        )
    }
}

export default EditPlan;