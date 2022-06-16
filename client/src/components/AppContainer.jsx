import { Container, Row, Col } from "react-bootstrap";


import Navbar from './Navbar';
import Footer from "./Footer";
import Sidebar from "./Sidebar";


import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";



const AppContainer = (props) => {
    const [session] = useContext(AuthContext);
    return (
        <Container fluid className="app-container d-flex flex-column h-100">
            <Navbar />
            <Row className="flex-fill">
                {session.loggedIn &&
                    <Col xs={{ span: 12 }} lg={{ span: 2 }} className="sidebar-container ">
                        <Sidebar />
                    </Col>
                }
                <Col>
                    {props.children}
                </Col>
            </Row>

            <Footer />
        </Container>
    );
}

export default AppContainer;


