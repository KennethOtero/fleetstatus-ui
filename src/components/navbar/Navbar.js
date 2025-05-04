
import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../../util/AuthContext';
import { URI_LOGIN_PAGE } from '../../util/UriConstants';
import { logoutUser } from '../../pages/Login/Logout';

function Navbar({ isFullscreen }) {
    const { auth, checkLoginStatus } = useAuth();
    const location = useLocation();
    const navbarRef = useRef(null);
    const toggleRef = useRef(null);
    const navigate = useNavigate();

    const handleClick = () => {
        if (auth.authenticated) {
            logoutUser(checkLoginStatus, navigate);
        } else {
            navigate(URI_LOGIN_PAGE);
        }
    };

    // Highlight active link
    useEffect(() => {
        const links = document.querySelectorAll('.nav__link');
        links.forEach(link => {
            const linkPath = new URL(link.href, window.location.origin).pathname;
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

    const isAdmin = Array.isArray(auth.roles) && auth.roles.includes('ROLE_Admin');

    return (
        <div id='sideMenu' style={{ display: isFullscreen ? 'none' : 'block' }}>
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
                            {isAdmin && (
                                <Link to="/AircraftStatus" className="nav__link" id="aircraftStatusPage">
                                    <ion-icon name="airplane-outline" className="nav__icon"></ion-icon>
                                    <span className="nav__name" id="aircraftStatusText">Aircraft Status</span>
                                </Link>
                            )}
                            <Link to="/History" className="nav__link">
                                <ion-icon name="reader-outline" className="nav__icon"></ion-icon>
                                <span className="nav__name">History</span>
                            </Link>
                        </div>
                    </div>
                    <div onClick={handleClick} className='nav__link' id='loginStatus' style={{ cursor: 'pointer' }}>
                        <ion-icon name="log-out-outline" className="nav__icon"></ion-icon>
                        <span className="nav__name" id="loginStatusText">{auth.authenticated ? 'Sign Out' : 'Sign In'}</span>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Navbar;
