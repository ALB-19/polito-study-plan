import { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

import LoginForm from "../components/LoginForm";

const LogIn = () => {
    const [session] = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (session.loggedIn)
            navigate('/all', { replace: true });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!session.loggedIn)
        return (
            <Row className="p-4 my-4 flex-fill align-items-center">
                <div className="text-center">
                    <h1 className="fw-extrabold text-black text-center">Benvenuto</h1>
                </div>
                <Col xs={{ span: 12 }} lg={{ span: 6 }} className="mx-auto">
                    <LoginForm />
                
                </Col>
            </Row>
        );
}

export default LogIn;