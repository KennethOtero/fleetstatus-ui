import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AlertBox } from '../../../components/alertbox/AlertBox';
import { URI_EVENTS } from '../../../util/UriConstants';
import Select from 'react-select';
import { customDarkStyles } from '../../../components/select/Select';

function EditEventModal({ show, handleClose, refreshTable, event }) {
    const [error, setError] = useState('');
    const [reasons, setReasons] = useState([]);
    const [formData, setFormData] = useState({
        selectedReasons: [],
        nextUpdate: '',
        remark: '',
        startTime: ''
    });

    useEffect(() => {
        if (show) {
            insertEditFields();
        }
    }, [show]);

    const insertEditFields = () => {
        if (!event) return;

        setFormData({
            selectedReasons: event.reason || [],
            nextUpdate: event.nextUpdate ? event.nextUpdate.slice(0, 16) : '',
            remark: event.remark || '',
            startTime: event.startTime ? event.startTime.slice(0, 16) : ''
        });

        setReasons(event.reason || []);
    };

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData({...formData, [id]: value});
    };

    const validateForm = () => {
        const {selectedReasons, nextUpdate, remark, startTime} = formData;
        if (selectedReasons.length === 0 || !nextUpdate || !remark || !startTime) {
            setError('One or more fields are empty.');
            return false;
        }
        setError('');
        return true;
    };

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

    const convertDateToSQL = (dateString) => {
        return new Date(dateString).toISOString();
    };

    const handleSubmit = async () => {
        if (!validateForm()) return false;

        try {
            const request = [
                {op: 'replace', path: '/reason', value: formData.selectedReasons},
                {op: "replace", path: "/nextUpdate", value: convertDateToSQL(formData.nextUpdate)},
                {op: "replace", path: "/remark", value: formData.remark.trim()},
                {op: "replace", path: "/startTime", value: convertDateToSQL(formData.startTime)}
            ];

            const response = await fetch(`${URI_EVENTS}/${event.eventId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });

            if (response.status === 200) {
                handleClose();
                refreshTable();
            } else {
                setError('An error occurred editing the event.');
            }
        } catch(err) {
            console.error(err);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <div className='dark-modal-content'>
                <Modal.Header closeButton>
                    <Modal.Title>Edit {event.aircraft.tailNumber} Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <AlertBox message={error} trigger={error}></AlertBox>}
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
                    <Button variant="primary" onClick={handleSubmit} className='border-0'>EDIT</Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}

export default EditEventModal;