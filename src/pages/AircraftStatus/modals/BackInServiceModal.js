import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AlertBox } from '../../../components/alertbox/AlertBox';
import { URI_SHOW_BACK_IN_SERVICE } from '../../../util/UriConstants';

function BackInServiceModal({ show, handleClose, refreshTable, event }) {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        backInService: ''
    });
    const eventId = event.eventId;

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData({...formData, [id]: value});
    };

    const validateForm = () => {
        const {backInService} = formData;
        if (!backInService) {
            setError('Select a back-in-service date.');
            return false;
        }

        const startDate = new Date(event.startTime);
        const endDate = new Date(backInService);
        if (endDate < startDate) {
            setError('Date cannot be before original out-of-service date.');
            return false;
        }
        
        setError('');
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetch(`${URI_SHOW_BACK_IN_SERVICE}/${eventId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: new Date(formData.backInService).toISOString()
            });

            if (response.status === 200) {
                handleClose();
                refreshTable();
            } else {
                setError('An error occurred saving the back in service date.');
            }
        } catch(err) {
            console.error(err);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <div className='dark-modal-content'>
                <Modal.Header closeButton>
                    <Modal.Title>Set {event.aircraft.tailNumber} Back In Service</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <AlertBox message={error} trigger={error}></AlertBox>}
                    <Form.Group>
                        <Form.Label>Enter Time</Form.Label>
                        <Form.Control id='backInService' type='datetime-local' value={formData.backInService} onChange={handleChange}></Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit} className='border-0'>SUBMIT</Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}

export default BackInServiceModal;