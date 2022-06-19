import { Row } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
    return (
        <Row className='footer'>
            <footer className='bg-light text-dark p-5'>
               <div className='d-block d-lg-flex justify-content-between'>
                <h6 className='fw-bold my-2'>Copyright  2022 by Anna Lisa Belardo &copy;
                </h6>
                <div >
                        <a href="https://github.com/polito-AW1-2022-exams/esame1-piano-studi-ALB-19/tree/dev" rel='noreferrer' target='_blank' className='link-dark ms-5'><FontAwesomeIcon icon={faGithub} size="lg" className="me-2" /></a>
                        <a href="https://www.linkedin.com/in/anna-lisa-belardo-0bb381173/" rel='noreferrer' target='_blank' className='link-dark ms-5'><FontAwesomeIcon icon={faLinkedin} size="lg" className="me-2" /></a>
                  
                    </div>
                </div>
            </footer>
        </Row>
    );
}

export default Footer;
