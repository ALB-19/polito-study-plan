import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = ({ show, onHide, onConfirm, title }) => {
    return (
        <Modal show={show} onHide={onHide} centered size={"lg"}>
            <Modal.Header className="border-0 justify-content-center mt-3">
                <Modal.Title className="fw-bold text-danger text-center">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="small text-dark text-center">
                <span className="text-secondary">Conferma la tua scelta.</span>
             
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="light" onClick={onHide} className='fw-bold rounded-3'>
                    <span className="opacity-50">Close</span>
                </Button>
                <Button variant="danger" onClick={onConfirm} className='fw-bold rounded-3'>
                    <span className="text-light">Confirm</span>
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmationModal;