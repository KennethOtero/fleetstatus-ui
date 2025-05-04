import React from 'react';
import './AircraftStatus.css';

function AircraftStatus() {
    return(
        <div>
            <div className="container">
                <h2 className="PageTitle">Manage Fleet Status</h2>

                <div className="row table-buttons">
                    <div className="col-sm">
                        <button type="button" className="btn btn-primary border-0" data-bs-toggle="modal" data-bs-target="#addTailEvent">Add New Tail Event</button>
                    </div>
                    <div className="col-sm text-end">
                        <button type="button" className="btn btn-primary border-0" data-bs-toggle="modal" data-bs-target="#addAircraft">Add Aircraft</button>
                        <button type="button" className="btn btn-primary border-0" data-bs-toggle="modal" data-bs-target="#removeAircraft">Remove Aircraft</button>
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
                        {}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AircraftStatus;