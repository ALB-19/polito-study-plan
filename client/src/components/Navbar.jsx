import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Navbar as BSNavbar, Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import useNotification from "../hooks/useNotification";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";



const Navbar = ({ setCourse }) => {
    const [session, , setDirty] = useContext(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();
    const notify = useNotification();

    const handleLogout = () => {
        api.logout()
            .then(() => {
                setDirty(true)
                // setSession({ user: undefined, loggedIn: false });
                setCourse([]);
                navigate('/', { replace: true });
            })
            .catch((err) => notify.error(err));
    }
    return (
        <Row >
            <BSNavbar bg="light" variant="light" expand="lg">
                <Container fluid>
                    <BSNavbar.Brand className='fs-1 fw-black text-dark'>
                        < img src="https://upload.wikimedia.org/wikipedia/it/thumb/2/27/Politecnico_di_Torino_-_Logo.svg/1200px-Politecnico_di_Torino_-_Logo.svg.png"
                            width="70"
                            height="70"
                            alt="for sell"
                            className="d-inline-block align-top me-3">
                        </img>
                        Politecnico di Torino
                    </BSNavbar.Brand>

                    <div className="d-flex align-items-center">
                        {session.loggedIn && <h6 className='text-dark fw-light mb-0'>
                            <FontAwesomeIcon icon={faUser} size='lg' className='me-3 ' />
                            Ciao,{session.user ? session.user.name : "user"}
                        </h6>}
                        {session.loggedIn ? <Button variant='secondary' size='sm' className='ms-4 px-3 text-white fw-semibold' onClick={handleLogout}>
                            Logout
                        </Button> :
                            (
                                location.pathname !== '/login' ?
                                    <Link to="/login">
                                        <Button variant='secondary' size='sm' className='ms-4 px-3 text-white fw-semibold'>
                                            <FontAwesomeIcon icon={faUser} size='lg' className='me-3' />
                                            Login
                                        </Button>
                                    </Link> :
                                    <Link to="/">
                                        <Button variant='secondary' size='sm' className='ms-4 px-3 text-white fw-semibold'>
                                            Homepage
                                        </Button>
                                    </Link>
                            )

                        }
                    </div>
                </Container>
            </BSNavbar>
        </Row>

    );
}

export default Navbar;