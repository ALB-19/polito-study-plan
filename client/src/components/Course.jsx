import { Button, Row } from "react-bootstrap";
import { Accordion } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const Course = (props) => {

    if (props.course.length === 0 && !props.removeList)
        return (
            <Row className="flex-fill ">
                <h4 className="mt-3 mb-3  " > Ancora nessun corso presente nel piano di studio</h4>
            </Row>
        );
    else
        return (
            <Row className="flex-fill ">
                {!props.removeList && <h4 className="mt-3 mb-3  " > Offerta formativa </h4>}
                {props.removeList && <h4 className="mt-3 mb-3  " > Il mio piano studio </h4>}
                {(props.removeList && props.course.length === 0) && <h6 className="mt-3 mb-3  " > Nessun corso qua... seleziona corsi da offerta formativa</h6>}

                <Accordion alwaysOpen  >
                    {props.course.map((course, index) => {
                        return (
                            <Accordion.Item eventKey={index} key={index} className={course.disable ? "opacity-25" : null} >

                                <Accordion.Header className="w-100">
                                    <div >
                                        <span className="code-text">{course.Code}</span> {course.Nome}
                                        <h6 className="mt-2">
                                            CFU: {course.CFU}
                                        </h6>
                                        <h6>
                                            {course.Max_Studenti ? `Numero massimo di studenti: ${course.Max_Studenti}` : 'Corso libero a tutti'}
                                        </h6>
                                        <h6>
                                            {course.Iscritti ? `Numero di studenti iscritti: ${course.Iscritti}` : 'Nessuno studente iscritto'}
                                        </h6>
                                    </div>
                                </Accordion.Header>

                                <Accordion.Body>
                                    <h6>{course.Propedeuticità.Code ? `Propedeuticità: ${course.Propedeuticità.Code} - ${course.Propedeuticità.Name} ` : 'Non ci sono Propedeuticità'} </h6>
                                    {
                                        course.incompatibilita ?
                                            course.incompatibilita.map((incomp, index) => {
                                                return (
                                                    <h6 key={index}>Incompatibilità: {incomp.Code} - {incomp.Name}</h6>
                                                )
                                            }) : <h6>Nessun corso incompatibile</h6>
                                    }
                                </Accordion.Body>
                                <div className="p-3">
                                    {props.addList &&
                                        <Button variant="light" onClick={() => props.add(course)}>
                                            <FontAwesomeIcon icon={faPlus} size='lg' />
                                        </Button>
                                    }
                                    {props.removeList &&
                                        <Button variant="light" onClick={() => props.remove(course)}>
                                            <FontAwesomeIcon icon={faTrashAlt} size='lg' />
                                        </Button>
                                    }
                                </div>



                            </Accordion.Item>
                        )
                    }
                    )}
                </Accordion>
            </Row>
        );
}

export default Course;