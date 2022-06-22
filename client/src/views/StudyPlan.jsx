import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import useNotification from '../hooks/useNotification';
import Course from "../components/Course";
import ConfirmationModal from '../components/ConfirmationModal';
import useModal from '../hooks/useModal';


import api from "../services/api";


const StudyPlan = (props) => {
    const [session, setSession, setDirty] = useContext(AuthContext);
    const [types, setTypes] = useState([]);
    const notify = useNotification();

    useEffect(() => {
        api.getType()
            .then((types) => {
                setTypes(types);
            })
            .catch(err => notify.error(err.message))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleStudyPlan = (typeId) => {
        const type = types.find(type => type.ID === typeId);
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

    const [modal, setModal] = useModal(() => {
        if (session.plan.ID) {
            api.deleteStudyPlan(session.plan.ID)
            .then(()=>{
                setDirty(true);
            })
            .catch((error)=>{
                notify.error(error.message)
            })
        }
        else {
            setSession((old) => ({
                ...old,
                plan: null,
            }))

        }
        notify.error('Piano di studio eliminato')

    });



    return (
        <div className="px-3">
            <ConfirmationModal show={modal} onHide={setModal.onHide} onConfirm={setModal.onConfirm} title="Sei sicuro di voler eliminare il tuo piano di studio?" />
            {session.plan ?
                <>
                    <div className="d-flex justify-content-between mt-4">
                        <div>
                            <h4>Il mio piano di studio</h4>
                            <h6>Tipologia: {session.plan.type.Nome}</h6>
                            <h6>Crediti: {session.plan.Crediti}</h6>
                        </div>
                        <div>
                            <Link to="/studyPlan/edit">
                                <Button variant="secondary" className="mx-2">
                                    <FontAwesomeIcon icon={faPencil} size='lg' className='me-3' />
                                    Modifica
                                </Button>
                            </Link>
                            <Button variant="secondary" className="mx-2" onClick={setModal.onShow}>
                                <FontAwesomeIcon icon={faTrashCan} size='lg' className='me-3' />
                                Elimina
                            </Button>
                        </div>
                    </div>
                    <Course course={props.course.filter(c => session.plan.courses.includes(c.Code))} />
                </> :
                <div className="d-flex flex-column align-items-center mt-5 ">
                    <h3>Crea il tuo piano di studio:</h3>
                    <div className="d-flex" >

                        {
                            types.map((type, index) => {
                                return (
                                    <div key={index} className="px-5 text-center mt-5">
                                        <h6 className="opacity-25">Scegliendo il piano di studio {type.Nome} dovrai aggiungere corsi fino a raggiungere un totale di CFU compreso tra {type.Min_Credits} e {type.Max_Credits} </h6>
                                        <Button className="my-3" variant="secondary" size="lg" onClick={() => handleStudyPlan(type.ID)}>
                                            {type.Nome}
                                        </Button>
                                    </div>
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