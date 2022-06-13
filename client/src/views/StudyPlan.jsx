import { AuthContext } from "../contexts/AuthContext"
import { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import useNotification from '../hooks/useNotification';
import { Link } from "react-router-dom";

import Course from "../components/Course";
import api from "../services/api";
import { useState } from "react";

const StudyPlan = () => {
    const [session, setSession] = useContext(AuthContext);
    const [types, setTypes] = useState([]);
    const notify = useNotification();

    useEffect(() => {
        //api per prendere i tipi 
        api.getType()
            .then((types) => {
                setTypes(types);
            })
            .catch(err => notify.error(err.message))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleStudyPlan = (typeId) => {
        const type = types.find(type => type.ID === typeId);
        console.log(type)
        setSession((old) => ({
            ...old,
            plan: {
                type: {
                    ID: type.ID,
                    Nome: type.Nome,
                    Max_Credits: type.Max_Credits,
                    Min_Credits: type.Min_Credits,
                },
                courses: [],
                Crediti: 0,
            }
        }))
    }

    const handleDelete = () => {
        if (session.plan.ID) {

        }
        else {
            setSession((old) => ({
                ...old,
                plan: null,
            }))
            notify.success('Piano di studio eliminato')
        }
    }

    return (
        <div className="px-3">
            {session.plan ?
                <>
                    <div className="d-flex justify-content-between mt-4">
                        <div>
                            <h4>Il mio piano di studio, chi sei?</h4>
                            <h6>Tipologia: {session.plan.type.Nome}</h6>
                            <h6>Crediti: {session.plan.Crediti}</h6>
                        </div>
                        <div>
                            <Link to="/studyPlan/edit">
                                <Button variant="secondary" className="mx-2">Modifica</Button>
                            </Link>
                            <Button variant="secondary" className="mx-2" onClick={handleDelete}>Elimina</Button>
                        </div>
                    </div>
                    <Course course={session.plan.courses} />
                </> :
                <div className="d-flex flex-column align-items-center mt-5 ">
                    <h3>Crea il tuo piano di studio:</h3>
                    <div className="d-flex flex-column" >

                        {
                            types.map((type, index) => {
                                return (
                                    <Button key={index} className="my-3" variant="secondary" size="lg" onClick={() => handleStudyPlan(type.ID)}>
                                        {type.Nome}
                                    </Button>
                                );
                            })
                        }
                    </div>


                </div>

            }
        </div>
    );
}

export default StudyPlan;