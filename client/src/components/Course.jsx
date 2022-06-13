import { Row } from "react-bootstrap";
import { Accordion } from "react-bootstrap";


const Course = (props) => {

    if (props.course.length === 0)
        return (
            <Row className="flex-fill ">
                <h4 className="mt-3 mb-3  " > Nessun corso qua...</h4>
            </Row>
        );
    else
        return (
            <Row className="flex-fill ">
                <h4 className="mt-3 mb-3  " > Offerta formativa </h4>
                <Accordion alwaysOpen  >
                    {props.course.map((course, index) => {
                        return (
                            <Accordion.Item eventKey={index} key={index} >
                                <Accordion.Header>
                                    <div>
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
                                    <h6>{course.Propedeuticità.Code ? `${course.Propedeuticità.Code} ${course.Propedeuticità.Name} ` : 'Non ci sono Propedeuticità'} </h6>
                                    {
                                        course.incompatibilita ?
                                            course.incompatibilita.map((incomp, index) => {
                                                return (
                                                    <h6 key={index}>Corso incompatibile {incomp.Code} {incomp.Name}</h6>
                                                )
                                            }) : <h6>Nessun corso incompatibile</h6>
                                    }


                                </Accordion.Body>
                            </Accordion.Item>
                        )
                    }
                    )}
                </Accordion>
            </Row>
        );
}

export default Course;