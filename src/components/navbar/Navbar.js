
import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

function Navbar() {
    const location = useLocation();
    const navbarRef = useRef(null);
    const toggleRef = useRef(null);

    // Highlight active link
    useEffect(() => {
        const links = document.querySelectorAll('.nav__link');
        links.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (linkPath === location.pathname) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }, [location]);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                navbarRef.current &&
                (!navbarRef.current.contains(event.target)) &&
                (!toggleRef.current || !toggleRef.current.contains(event.target))
            ) {
                navbarRef.current.classList.remove('expander');
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

  return (
    <div id='sideMenu'>
        <div className="l-navbar" id="navbar" ref={navbarRef}>
            <nav className="nav">
                <div>
                    <div className="nav__brand">
                        <ion-icon name="menu-outline" className="nav__toggle" id="nav-toggle" onClick={() => navbarRef.current?.classList.toggle('expander')} />
                        <Link to="/" className="nav__logo">Fleet Status</Link>
                    </div>
                    <div className="nav__list">
                        <Link to="/" className="nav__link active">
                            <ion-icon name="home-outline" className="nav__icon"></ion-icon>
                            <span className="nav__name">Fleet Overview</span>
                        </Link>
                        <Link to="/AircraftStatus" className="nav__link hidden" id="aircraftStatusPage">
                            <ion-icon name="airplane-outline" className="nav__icon"></ion-icon>
                            <span className="nav__name" id="aircraftStatusText">Aircraft Status</span>
                        </Link>
                        <Link to="/History" className="nav__link">
                            <ion-icon name="reader-outline" className="nav__icon"></ion-icon>
                            <span className="nav__name">History</span>
                        </Link>
                    </div>
                </div>
                <Link to="/login" className="nav__link" id="loginStatus">
                    <ion-icon name="log-out-outline" className="nav__icon"></ion-icon>
                    <span className="nav__name" id="loginStatusText">Sign In</span>
                </Link>
            </nav>
        </div>
    </div>
  );
}

export default Navbar;
