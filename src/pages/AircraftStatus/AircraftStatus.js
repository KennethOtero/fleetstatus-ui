import { useEffect, useState } from 'react';
import './AircraftStatus.css';
import { fetchOOSEvents } from '../../util/DataService';
import GreenAircraft from '../../assets/images/SmallGreenAircraft.png';
import RedAircraft from '../../assets/images/SmallRedAircraft.png';
import AddEventModal from './modals/AddEventModal';
import AddAircraftModal from './modals/AddAircraftModal';
import RemoveAircraftModal from './modals/RemoveAircraftModal';
import BackInServiceModal from './modals/BackInServiceModal';
import EditEventModal from './modals/EditEventModal';

function AircraftStatus() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState({
        type: null,
        event: null
    });

    const refreshTable = () => {
        fetchEvents();
    };

    useEffect(() => {
        fetchEvents();

        const intervalId = setInterval(() => {
            fetchEvents();
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchEvents = async () => {
        try {
            setEvents(await fetchOOSEvents());
        } catch(error) {
            console.error("Error fetching events:", error);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return(
        <div>
            <div className="container">
                <h2 className="PageTitle">Manage Fleet Status</h2>

                <div className="row table-buttons">
                    <div className="col-sm">
                        <button type="button" className="btn btn-primary border-0" onClick={() => setShowModal({type: 'addEvent', event: null})}>Add New Tail Event</button>
                        {showModal.type === 'addEvent' && (
                            <AddEventModal 
                                show={true}
                                handleClose={() => setShowModal({ type: null, event: null })}
                                refreshTable={refreshTable}
                            />
                        )}
                    </div>
                    <div className="col-sm text-end">
                        <button type="button" className="btn btn-primary border-0" onClick={() => setShowModal({type: 'addAircraft', event: null})}>Add Aircraft</button>
                        {showModal.type === 'addAircraft' && (
                            <AddAircraftModal 
                                show={true}
                                handleClose={() => setShowModal({ type: null, event: null })}
                                refreshTable={refreshTable}
                            />
                        )}
                        <> </>
                        <button type="button" className="btn btn-primary border-0" onClick={() => setShowModal({type: 'removeAircraft', event: null})}>Remove Aircraft</button>
                        {showModal.type === 'removeAircraft' && (
                            <RemoveAircraftModal 
                                show={true}
                                handleClose={() => setShowModal({ type: null, event: null })}
                                refreshTable={refreshTable}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="container">
                <table className="table text-white custom-table">
                    <thead>
                        <tr>
                            <th scope="col">Status</th>
                            <th scope="col">Tail #</th>
                            <th scope="col">Reason</th>
                            <th scope="col">Next Update</th>
                            <th scope="col">Remark</th>
                            <th scope="col">Back in Service</th>
                            <th scope="col">Edit</th>
                        </tr>
                    </thead>
                    <tbody id="statusDisplay">
                        {events.length === 0 ? (
                            <tr className='text-white text-center bg-dark'>
                                <td colSpan='7'>No current events.</td>
                            </tr>
                        ) : (
                            events.map(event => (
                                <tr key={event.eventId}>
                                    <td>
                                        <img src={event.backInService ? GreenAircraft : RedAircraft} alt="aircraft status"/>
                                    </td>
                                    <td>{event.aircraft.tailNumber}</td>
                                    <td>{event.reasonString}</td>
                                    <td>{formatTime(event.nextUpdate)}</td>
                                    <td>{event.remark}</td>
                                    <td>
                                        <button className='btn btn-primary border-0' onClick={() => setShowModal({type: 'backInService', event})}>Set</button>
                                        {showModal.type === 'backInService' && showModal.event?.eventId === event.eventId && (
                                            <BackInServiceModal 
                                                show={true}
                                                handleClose={() => setShowModal({ type: null, event: null })}
                                                refreshTable={refreshTable}
                                                event={showModal.event}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <button className='btn btn-primary border-0' onClick={() => setShowModal({type: 'editEvent', event})}>Edit</button>
                                        {showModal.type === 'editEvent' && showModal.event?.eventId === event.eventId && (
                                            <EditEventModal 
                                                show={true}
                                                handleClose={() => setShowModal({ type: null, event: null })}
                                                refreshTable={refreshTable}
                                                event={showModal.event}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AircraftStatus;