import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { URI_EVENTS } from '../../../util/UriConstants';
import { fetchAircraft, fetchReasons } from '../../../util/DataService';
import { AlertBox } from '../../../components/alertbox/AlertBox';
import Select from 'react-select';
import { customDarkStyles } from '../../../components/select/Select';

function AddEventModal({ show, handleClose, refreshTable }) {
    const [tailNumbers, setTailNumbers] = useState([]);
    const [reasons, setReasons] = useState([]);
    const [formData, setFormData] = useState({
        aircraftId: '',
        selectedReasons: [],
        nextUpdate: '',
        remark: '',
        startTime: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData({...formData, [id]: value});
    };

    const validateForm = () => {
        const { aircraftId, selectedReasons, nextUpdate, remark, startTime } = formData;
        if (!aircraftId || selectedReasons.length === 0 || !nextUpdate || !remark || !startTime) {
            setError('One or more fields are empty.');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const event = {
            aircraft: { aircraftId: formData.aircraftId },
            reason: formData.selectedReasons,
            nextUpdate: convertDateToSQL(formData.nextUpdate),
            remark: formData.remark,
            backInService: 0,
            startTime: convertDateToSQL(formData.startTime)
        };

        try {
            const response = await fetch(URI_EVENTS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            });

            if (response.status === 201) {
                handleClose();
                refreshTable();
            } else if (response.status === 409) {
                setError('This tail number already exists');
            } else {
                setError('An unexpected error occurred.');
            }
        } catch(error) {
            console.log(error);
        }
    };

    const convertDateToSQL = (dateString) => {
        return new Date(dateString).toISOString();
    };

    useEffect(() => {
        if (show) {
            const fetchData = async () => {
                try {
                    const aircraftData = await fetchAircraft();
                    const reasonData = await fetchReasons();
                    setTailNumbers(aircraftData);
                    setReasons(reasonData);
                } catch(error) {
                    console.error(error);
                }
            };

            fetchData();
        }
    }, [show]);

    // Set multi-select logic and data
    const reasonOptions = reasons.map(r => ({
        value: r.reasonId,
        label: r.reason
    }));

    const handleReasonChange = selectedOptions => {
        const selected = selectedOptions.map(option => ({
            reasonId: option.value,
            reason: option.label
        }));
        setFormData({...formData, selectedReasons: selected});
    };

    const selectedReasonOptions = reasonOptions.filter(option => formData.selectedReasons.some(r => r.reasonId === option.value));

    return (
        <Modal show={show} onHide={handleClose}>
            <div className='dark-modal-content'>
                <Modal.Header closeButton>
                    <Modal.Title>Add a New Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <AlertBox message={error} trigger={error}></AlertBox>}
                    <Form.Group>
                        <Form.Label>Select Tail Number</Form.Label>
                        <Form.Select id="aircraftId" value={formData.aircraftId} onChange={handleChange}>
                            <option value="">Select Tail</option>
                            {tailNumbers.map(tail => (
                                <option key={tail.aircraftId} value={tail.aircraftId}>{tail.tailNumber}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Select Reason</Form.Label>
                        <Select 
                            isMulti
                            id='reason'
                            options={reasonOptions}
                            value={selectedReasonOptions}
                            onChange={handleReasonChange}
                            styles={customDarkStyles}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Enter Next Update</Form.Label>
                        <Form.Control type="datetime-local" id="nextUpdate" value={formData.nextUpdate} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Enter Remark</Form.Label>
                        <Form.Control type="text" id="remark" placeholder="e.g. Bird strike to the #1 engine" value={formData.remark} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Enter Start Time</Form.Label>
                        <Form.Control type="datetime-local" id="startTime" value={formData.startTime} onChange={handleChange} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit} className='border-0'>ADD</Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}

export default AddEventModal;