import { Row, Col } from "react-bootstrap";
import Course from "../components/Course";


const Home = (props) =>{

    return (
        <Row className="flex-fill">
            <Col >
            <Course course={props.course}/>
            </Col>
        </Row>
    );
}
export default Home;

