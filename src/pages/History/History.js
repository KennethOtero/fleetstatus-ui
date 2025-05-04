import React, { useEffect, useState } from 'react';
import CalendarView from './CalendarView';
import { fetchCarriers, fetchTypes, fetchReasons, fetchAircraft, fetchEventHistory, buildFilterUrl } from '../../util/DataService';
import { URI_CALENDER_EVENT_HISTORY, URI_CSV, URI_DOWNTIME_REPORT, URI_EVENT_HISTORY } from '../../util/UriConstants';
import Select from 'react-select';
import { customDarkStyles } from '../../components/select/Select';

function History() {

    const [carriers, setCarriers] = useState([]);
    const [types, setTypes] = useState([]);
    const [reasons, setReasons] = useState([]);
    const [tails, setTails] = useState([]);

    const [selectedCarrier, setSelectedCarrier] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedTail, setSelectedTail] = useState('');
    const [selectedReasons, setSelectedReasons] = useState([]);

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [calendarEvents, setCalendarEvents] = useState([]);
    const [tableEvents, setTableEvents] = useState([]);

    useEffect(() => {
        const now = new Date();
        const dayBefore = new Date(now);
        dayBefore.setDate(now.getDate() - 1);
        const nowISOString = now.toISOString().slice(0, 16);
        const dayBeforeISOString = dayBefore.toISOString().slice(0, 16);
        setStartTime(dayBeforeISOString);
        setEndTime(nowISOString);

        const loadData = async () => {
            const [carrierData, typeData, reasonData, tailData] = await Promise.all([
                fetchCarriers(),
                fetchTypes(),
                fetchReasons(),
                fetchAircraft()
            ]);

            setCarriers(carrierData);
            setTypes(typeData);
            setReasons(reasonData);
            setTails(tailData);
        };

        loadData();
        getEventHistory();
    }, []);

    const getEventHistory = async () => {
        if (new Date(startTime) > new Date(endTime)) {
            alert('Start time cannot be later than end time.');
            return;
        }

        const filters = {
            carrierId: selectedCarrier,
            typeId: selectedType,
            tailNumber: selectedTail,
            reasonIds: selectedReasons,
            startDate: startTime,
            endDate: endTime
        };

        const tableUrl = buildFilterUrl(URI_EVENT_HISTORY, filters);
        const calendarUrl = buildFilterUrl(URI_CALENDER_EVENT_HISTORY, filters);

        const [tableData, calendarData] = await Promise.all([
            fetchEventHistory(tableUrl),
            fetchEventHistory(calendarUrl)
        ]);

        setTableEvents(tableData);
        setCalendarEvents(calendarData.map(event => ({
            title: event.title,
            start: event.start,
            end: event.end || event.start,
            color: event.color || '#007bff',
            display: 'block'
        })));
    };
    
    const exportData = (uri) => {
        const filters = {
            carrierId: selectedCarrier,
            typeId: selectedType,
            tailNumber: selectedTail,
            reasonIds: selectedReasons,
            startDate: startTime,
            endDate: endTime
        };
        const url = buildFilterUrl(uri, filters);
        const link = document.createElement('a');
        link.href = url.toString();
        link.click();
    };

    // Set multi-select logic and data
    const reasonOptions = reasons.map(r => ({
        value: r.reasonId,
        label: r.reason
    }));

    const handleChange = selectedOptions => {
        const selectedValues = selectedOptions.map(option => option.value);
        setSelectedReasons(selectedValues);
    };

    const selectedOptions = reasonOptions.filter(option => selectedReasons.includes(option.value));

    return (
        <>
            <div className="container">
                <div>
                    <h2 className="PageTitle">Fleet History</h2>
                </div>
                <br />
            </div>
            <div className="container mb-3 dark-modal-content p-3 rounded">
                <div className="row g-2 align-items-end">
                    <div className="col-md-2">
                        <label htmlFor="carrierSelect" className="form-label">Carrier:</label>
                        <select id="carrierSelect" className="form-select" value={selectedCarrier} onChange={e => setSelectedCarrier(e.target.value)}>
                            <option value="">Select Carrier</option>
                            {carriers.map(c => <option key={c.carrierId} value={c.carrierId}>{c.carrierName}</option>)}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="typeSelect" className="form-label">Type:</label>
                        <select id="typeSelect" className="form-select" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                            <option value="">Select Type</option>
                            {types.map(t => <option key={t.typeId} value={t.typeId}>{t.typeName}</option>)}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="tailSelect" className="form-label">Tail #:</label>
                        <select id="tailSelect" className="form-select" value={selectedTail} onChange={e => setSelectedTail(e.target.value)}>
                            <option value="">Select Tail</option>
                            {tails.map(t => <option key={t.aircraftId} value={t.tailNumber}>{t.tailNumber}</option>)}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="reasonIds" className="form-label">Reason:</label>
                        <Select 
                            isMulti
                            id='reasonIds'
                            options={reasonOptions}
                            value={selectedOptions}
                            onChange={handleChange}
                            styles={customDarkStyles}
                        />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="startTime" className="form-label">Start Time:</label>
                        <input type="datetime-local" id="startTime" className="form-control" value={startTime} onChange={e => setStartTime(e.target.value)} />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="endTime" className="form-label">End Time:</label>
                        <input type="datetime-local" id="endTime" className="form-control"  value={endTime} onChange={e => setEndTime(e.target.value)} />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col">
                        <button className="btn btn-primary border-0 me-2" onClick={getEventHistory}>Filter</button>
                    </div>
                    <div className="col text-end">
                        <button type="button" className="btn btn-primary border-0 me-2" onClick={() => exportData(URI_DOWNTIME_REPORT)}>Aircraft Down Time Report</button>
                        <button type="button" className="btn btn-primary border-0" onClick={() => exportData(URI_CSV)}>Export</button>
                    </div>
                </div>
            </div>
        
            <div className="container">
                <table className="table text-white custom-table">
                    <thead>
                        <tr>
                            <th scope="col">Event Date</th>
                            <th scope="col">Tail #</th>
                            <th scope="col">Reason</th>
                            <th scope="col">Remark</th>
                            <th scope="col">Down Time</th>
                        </tr>
                    </thead>
                    <tbody id="statusDisplay">
                        {tableEvents.length === 0 ? (
                            <tr className="text-white text-center bg-dark">
                                <td colSpan="5">No current event history.</td>
                            </tr>
                        ) : (
                            tableEvents.map((event, index) => (
                                <tr key={index}>
                                    <td>{new Date(event.startTime).toLocaleDateString()}</td>
                                    <td>{event.aircraft.tailNumber}</td>
                                    <td>{event.reasonString}</td>
                                    <td>{event.remark}</td>
                                    <td>{event.downTime}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <br />
                <CalendarView events={calendarEvents} />
            </div>
        </>
    );
}

export default History;