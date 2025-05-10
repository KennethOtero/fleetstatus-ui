import { useEffect, useState } from 'react';
import { AlertBox } from '../../../components/alertbox/AlertBox';
import { fetchCarriers, fetchTypes } from '../../../util/DataService';
import { Modal, Button, Form } from 'react-bootstrap';
import { URI_AIRCRAFT } from '../../../util/UriConstants';

function AddAircraftModal({ show, handleClose, refreshTable }) {
    const [error, setError] = useState('');
    const [carriers, setCarriers] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        tailNumber: '',
        carrierId: '',
        typeId: ''
    });

    useEffect(() => {
        if (show) {
            const fetchData = async () => {
                try {
                    const carrierData = await fetchCarriers();
                    const typeData = await fetchTypes();
                    setCarriers(carrierData);
                    setTypes(typeData);
                } catch(error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [show]);

    const validateForm = () => {
        const {tailNumber, carrierId, typeId} = formData;
        if (!tailNumber || !carrierId || !typeId) {
            setError('One or more fields are empty.');
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

        const request = {
            tailNumber: formData.tailNumber,
            carrier: {
                carrierId: formData.carrierId
            },
            type: {
                typeId: formData.typeId
            }
        };

        try {
            const response = await fetch(URI_AIRCRAFT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });

            if (response.status === 201) {
                handleClose();
                refreshTable();
            } else if (response.status === 409) {
                setError('This tail number already exists');
            } else {
                setError('An error occurred saving the aircraft');
            }
        } catch(error) {
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <div className='dark-modal-content'>
                <Modal.Header closeButton>
                    <Modal.Title>Add an Aircraft</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <AlertBox message={error} trigger={error}></AlertBox>}
                    <Form.Group>
                        <Form.Label>Enter Tail Number</Form.Label>
                        <Form.Control  id='tailNumber' type='text' placeholder='e.g. N123XY' value={formData.tailNumber} onChange={handleChange} />
                        
                        <Form.Label>Select Carrier</Form.Label>
                        <Form.Select id='carrierId' value={formData.carrierId} onChange={handleChange}>
                            <option value=''>Select Carrier</option>
                            {carriers.map(carrier => (
                                <option key={carrier.carrierId} value={carrier.carrierId}>{carrier.carrierName}</option>
                            ))}
                        </Form.Select>
                        
                        <Form.Label>Select Type</Form.Label>
                        <Form.Select id='typeId' value={formData.typeId} onChange={handleChange}>
                            <option value=''>Select Type</option>
                            {types.map(type => (
                                <option key={type.typeId} value={type.typeId}>{type.typeName}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit} className='border-0'>ADD</Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}

export default AddAircraftModal;