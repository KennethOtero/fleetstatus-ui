import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { URI_AIRCRAFT } from '../../../util/UriConstants';
import { fetchAircraft } from '../../../util/DataService';
import { AlertBox } from '../../../components/alertbox/AlertBox';

function RemoveAircraftModal({ show, handleClose, refreshTable }) {
    const [error, setError] = useState('');
    const [aircraft, setAircraft] = useState([]);
    const [formData, setFormData] = useState({
        aircraftId: ''
    });

    useEffect(() => {
        if (show) {
            const fetchData = async () => {
                try {
                    const aircraftData = await fetchAircraft();
                    setAircraft(aircraftData);
                } catch(error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [show]);

    const validateForm = () => {
        const {aircraftId} = formData;
        if (!aircraftId) {
            setError('Select a tail number to delete.');
            return false;
        }
        setError('');
        return true;
    };

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData({...formData, [id]: value});
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetch(`${URI_AIRCRAFT}?aircraftId=${formData.aircraftId}`, {
                method: 'DELETE'
            });

            if (response.status === 200) {
                handleClose();
                refreshTable();
            } else {
                setError('An error occurred deleting the aircraft.');
            }
        } catch(err) {
            console.error(err);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <div className='dark-modal-content'>
                <Modal.Header closeButton>
                    <Modal.Title>Remove an Aircraft</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <AlertBox message={error} trigger={error}></AlertBox>}
                    <Form.Group>
                        <Form.Label>Select Aircraft to Remove</Form.Label>
                        <Form.Select id='aircraftId' value={formData.aircraftId} onChange={handleChange}>
                            <option value=''>Select Aircraft</option>
                            {aircraft.map(tail => (
                                <option key={tail.aircraftId} value={tail.aircraftId}>{tail.tailNumber}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit} className='border-0'>REMOVE</Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}

export default RemoveAircraftModal;