import React, {useEffect, useState} from 'react';
import './Homepage.css';
import { URI_EVENTS } from '../../util/UriConstants';
import GreenAircraft from '../../assets/images/GreenAircraft.png';
import RedAircraft from '../../assets/images/redAircraft.png';

function Home({ isFullscreen, setIsFullscreen }) {
    const [aircraft, setAircraft] = useState([]);

    // Fetch aircraft data
    useEffect(() => {
        fetchAircraft();
        const interval = setInterval(fetchAircraft, 10000);
        return () => clearInterval(interval);
    }, []);
    
    
    const fetchAircraft = () => {
        fetch(URI_EVENTS)
            .then(res => res.json())
            .then(data => setAircraft(data))
            .catch(err => console.error(err));
    };
    
    // Fullscreen toggle
    const handleFullscreenToggle = async (e) => {
        const checked = e.target.checked;
        setIsFullscreen(checked);
        
        try {
            if (checked) {
                await document.documentElement.requestFullscreen?.();
            } else {
                await document.exitFullscreen?.();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Disable fullscreen mode if the user exits fullscreen themselves
    useEffect(() => {
        const handleFullscreenChange = () => {
          const isFull = !!document.fullscreenElement;
          setIsFullscreen(isFull);
        };
      
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [setIsFullscreen]);

    // Apply bg-black to the entire body
    useEffect(() => {
        if (isFullscreen) {
          document.body.classList.add('bg-black');
        } else {
          document.body.classList.remove('bg-black');
        }
      }, [isFullscreen]);
      
    
    const truncateText = (text) => {
        return text.length <= 100 ? text : text.substring(0, 100) + '...';
    };
    
    return (
        <div className={isFullscreen ? 'bg-black' : ''}>
            <div className="fullscreen-checkbox form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="fullscreenCheckbox"
                    onChange={handleFullscreenToggle}
                    checked={isFullscreen}
                />
            </div>
    
            <div className={`container ${isFullscreen ? 'd-none' : 'd-block'}`} id="titleContainer">
                <h2 className="PageTitle">Fleet Status</h2>
            </div>
    
            <div className={isFullscreen ? 'container-fluid' : 'container'} id="aircraftContainer">
                <div className="row justify-content-center" id="outOfServiceAircraft">
                    {aircraft.map((event, index) => {
                        const imagePath = event.backInService ? GreenAircraft : RedAircraft;
    
                        return (
                            <div key={index} className={`card-identifier ${isFullscreen ? 'col-2' : 'col-3'}`}>
                                <div className={`card text-white mb-3 ${isFullscreen ? 'bg-black' : 'bg-dark'}`}>
                                    <img src={imagePath} alt="aircraft status" className="card-img-top" />
                                    <div className="card-body">
                                        <p className="card-title">{event.aircraft.tailNumber}</p>
                                        <p className="card-text">{event.reasonString}</p>
                                        <p className="card-text">{truncateText(event.remark)}</p>
                                        <p>{event.backInService === 0 ? 'Next Update:' : 'Down Time:'}</p>
                                        <p className="card-text">
                                            {event.backInService === 0 ? event.nextUpdate : event.downTime}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Home;