import React from 'react';
import { Link } from 'react-router-dom';
import '.navbar.css';

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

    // Toggle sidebar
    useEffect(() => {
        const toggle = toggleRef.current;
        const navbar = navbarRef.current;

        const handleToggle = () => {
            navbar.classList.toggle('expander');
        };

        toggle?.addEventListener('click', handleToggle);

        return () => {
            toggle?.removeEventListener('click', handleToggle);
        };
    }, []);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target) && !toggleRef.current.contains(event.target)) {
                navbarRef.current.classList.remove('expander');
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

  return (
    <div className="l-navbar" id="navbar">
        <nav className="nav">
            <div>
                <div className="nav__brand">
                    <ion-icon name="menu-outline" class="nav__toggle" id="nav-toggle"></ion-icon>
                    <Link to="/" className="nav__logo">Fleet Status</Link>
                </div>
                <div className="nav__list">
                    <Link to="/" className="nav__link active">
                        <ion-icon name="home-outline" class="nav__icon"></ion-icon>
                        <span className="nav__name">Fleet Overview</span>
                    </Link>
                    <Link to="/AircraftStatus" className="nav__link hidden" id="aircraftStatusPage">
                        <ion-icon name="airplane-outline" class="nav__icon"></ion-icon>
                        <span className="nav__name" id="aircraftStatusText">Aircraft Status</span>
                    </Link>
                    <Link to="/History" className="nav__link">
                        <ion-icon name="reader-outline" class="nav__icon"></ion-icon>
                        <span className="nav__name">History</span>
                    </Link>
                </div>
            </div>
            <Link to="/login" className="nav__link" id="loginStatus">
                <ion-icon name="log-out-outline" class="nav__icon"></ion-icon>
                <span className="nav__name" id="loginStatusText">Sign In</span>
            </Link>
        </nav>
    </div>
  );
}

export default Navbar;
