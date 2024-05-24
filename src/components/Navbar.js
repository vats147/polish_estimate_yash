import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useAuth } from './Auths';


const Navbar = ({ handellogout }) => {

    const navigate = useNavigate();
    const auth = useAuth();

    const logout = () => {
        auth.logout();
        handellogout();
        navigate('/login');
    }

    const [sidebarType, setSidebarType] = useState('full');
    const [isMiniSidebar, setIsMiniSidebar] = useState(false);

    useEffect(() => {
        const updateSidebarType = () => {
            const width = window.innerWidth > 0 ? window.innerWidth : window.screen.width;
            if (width < 1199) {
                setSidebarType('mini-sidebar');
                setIsMiniSidebar(true);
            } else {
                setSidebarType('full');
                setIsMiniSidebar(false);
            }
        };

        // Initial setting
        updateSidebarType();

        // Attach resize listener
        window.addEventListener('resize', updateSidebarType);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('resize', updateSidebarType);
        };
    }, []);

    const toggleSidebar = () => {
        const newSidebarType = isMiniSidebar ? 'full' : 'mini-sidebar';
        setIsMiniSidebar(!isMiniSidebar);
        setSidebarType(newSidebarType);
    };


    return (
        <>
            {/*  Body Wrapper */}
            <div
                id="main-wrapper"
                className={`page-wrapper ${isMiniSidebar ? 'mini-sidebar show-sidebar' : ''}`}
                data-layout="vertical"
                data-navbarbg="skin6"
                data-sidebartype={sidebarType}
                data-sidebar-position="fixed"
                data-header-position="fixed"
            >
                {/* Sidebar Start */}
                <aside className="left-sidebar">
                    {/* Sidebar scroll*/}
                    <div>
                        <div className="brand-logo d-flex align-items-center justify-content-between">
                            <a href="./index.html" className="text-nowrap logo-img">
                                <img
                                    src="../assets/images/logos/dark-logo.svg"
                                    width={180}
                                    alt=""
                                />
                            </a>
                            
                                <div
                                onClick={toggleSidebar}
                                    className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
                                    id="sidebarCollapse"
                                >
                                    <i className="ti ti-x fs-8" />
                                </div>
                           

                        </div>
                        {/* Sidebar navigation*/}
                        <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
                            <ul id="sidebarnav">
                                <li className="nav-small-cap">
                                    <i className="ti ti-dots nav-small-cap-icon fs-4" />
                                    <span className="hide-menu">Home</span>
                                </li>
                                <li className="sidebar-item">
                                    <a
                                        className="sidebar-link"
                                        href="./index.html"
                                        aria-expanded="false"
                                    >
                                        <span>
                                            <i className="ti ti-layout-dashboard" />
                                        </span>
                                        <span className="hide-menu">Dashboard</span>
                                    </a>
                                </li>
                                <li className="nav-small-cap">
                                    <i className="ti ti-dots nav-small-cap-icon fs-4" />
                                    <span className="hide-menu">UI COMPONENTS</span>
                                </li>
                                <li className="sidebar-item">
                                    <NavLink to='/managecolor'>
                                        <a
                                            className="sidebar-link"
                                            href="./ui-buttons.html"
                                            aria-expanded="false"
                                        >
                                            <span>
                                                <i className="ti ti-article" />
                                            </span>
                                            <span className="hide-menu">Color</span>
                                        </a>
                                    </NavLink>
                                </li>
                                <li className="sidebar-item">
                                    <NavLink to='/adduser'>
                                        <a
                                            className="sidebar-link"

                                            aria-expanded="false"
                                        >
                                            <span>
                                                <i className="ti ti-user" />
                                            </span>
                                            <span className="hide-menu">Alerts</span>
                                        </a>
                                    </NavLink>
                                </li>
                                <li className="sidebar-item">
                                    <NavLink to='/displayorder'>
                                        <a
                                            className="sidebar-link"

                                            aria-expanded="false"
                                        >
                                            <span>
                                                <i className="ti ti-user" />
                                            </span>
                                            <span className="hide-menu">invoice</span>
                                        </a>
                                    </NavLink>
                                </li>
                                <li className="sidebar-item">
                                    <NavLink to='/finalorder'>
                                        <a
                                            className="sidebar-link"

                                            aria-expanded="false"
                                        >
                                            <span>
                                                <i className="ti ti-user" />
                                            </span>
                                            <span className="hide-menu">order</span>
                                        </a>
                                    </NavLink>
                                </li>
                                <li className="sidebar-item">
                                    <a
                                        className="sidebar-link"
                                        href="./ui-typography.html"
                                        aria-expanded="false"
                                    >
                                        <span>
                                            <i className="ti ti-typography" />
                                        </span>
                                        <span className="hide-menu">Typography</span>
                                    </a>
                                </li>
                                <li className="nav-small-cap">
                                    <i className="ti ti-dots nav-small-cap-icon fs-4" />
                                    <span className="hide-menu">AUTH</span>
                                </li>
                                <li className="sidebar-item">
                                    <a
                                        className="sidebar-link"
                                        href="./authentication-login.html"
                                        aria-expanded="false"
                                    >
                                        <span>
                                            <i className="ti ti-login" />
                                        </span>
                                        <span className="hide-menu">Login</span>
                                    </a>
                                </li>
                                <li className="sidebar-item">
                                    <NavLink to='/adduser'>
                                        <a
                                            className="sidebar-link"
                                            href="./authentication-register.html"
                                            aria-expanded="false"
                                        >
                                            <span>
                                                <i className="ti ti-user-plus" />
                                            </span>
                                            <span className="hide-menu">Register</span>
                                        </a>
                                    </NavLink>
                                </li>
                                <li className="nav-small-cap">
                                    <i className="ti ti-dots nav-small-cap-icon fs-4" />
                                    <span className="hide-menu">EXTRA</span>
                                </li>
                                <li className="sidebar-item">
                                    <a
                                        className="sidebar-link"
                                        href="./icon-tabler.html"
                                        aria-expanded="false"
                                    >
                                        <span>
                                            <i className="ti ti-mood-happy" />
                                        </span>
                                        <span className="hide-menu">Icons</span>
                                    </a>
                                </li>
                                <li className="sidebar-item">
                                    <a
                                        className="sidebar-link"
                                        href="./sample-page.html"
                                        aria-expanded="false"
                                    >
                                        <span>
                                            <i className="ti ti-aperture" />
                                        </span>
                                        <span className="hide-menu">Sample Page</span>
                                    </a>
                                </li>
                            </ul>
                            <div className="unlimited-access hide-menu bg-light-primary position-relative mb-7 mt-5 rounded">
                                <div className="d-flex">
                                    <div className="unlimited-access-title me-3">
                                        <h6 className="fw-semibold fs-4 mb-6 text-dark w-85">
                                            Upgrade to pro
                                        </h6>
                                        <a
                                            href="https://adminmart.com/product/modernize-bootstrap-5-admin-template/"
                                            target="_blank"
                                            className="btn btn-primary fs-2 fw-semibold lh-sm"
                                        >
                                            Buy Pro
                                        </a>
                                    </div>
                                    <div className="unlimited-access-img">
                                        <img
                                            src="../assets/images/backgrounds/rocket.png"
                                            alt=""
                                            className="img-fluid"
                                        />
                                    </div>
                                </div>
                            </div>
                        </nav>
                        {/* End Sidebar navigation */}
                    </div>
                    {/* End Sidebar scroll*/}
                </aside>
                {/*  Sidebar End */}
                {/*  Main wrapper */}
                <div className="body-wrapper">
                    {/*  Header Start */}
                    <header className="app-header">
                        <nav className="navbar navbar-expand-lg navbar-light">
                            <ul className="navbar-nav">
                                <li className="nav-item d-block d-xl-none">

                                    <a
                                        className="nav-link sidebartoggler nav-icon-hover"
                                        id="headerCollapse"
                                        href="javascript:void(0)"
                                        onClick={toggleSidebar}
                                    >
                                        <i className="ti ti-menu-2" />
                                    </a>




                                </li>
                                <li className="nav-item">
                                    <a className="nav-link nav-icon-hover" href="javascript:void(0)">
                                        <i className="ti ti-bell-ringing" />
                                        <div className="notification bg-primary rounded-circle" />
                                    </a>
                                </li>
                            </ul>
                            <div
                                className="navbar-collapse justify-content-end px-0"
                                id="navbarNav"
                            >
                                <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
                                    <a
                                        href="https://adminmart.com/product/modernize-free-bootstrap-admin-dashboard/"
                                        target="_blank"
                                        className="btn btn-primary"
                                    >
                                        Download Free
                                    </a>
                                    <li className="nav-item dropdown">
                                        <a
                                            className="nav-link nav-icon-hover"
                                            href="javascript:void(0)"
                                            id="drop2"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <img
                                                src="../assets/images/profile/user-1.jpg"
                                                alt=""
                                                width={35}
                                                height={35}
                                                className="rounded-circle"
                                            />
                                        </a>
                                        <div
                                            className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                                            aria-labelledby="drop2"
                                        >
                                            <div className="message-body">
                                                <a
                                                    href="javascript:void(0)"
                                                    className="d-flex align-items-center gap-2 dropdown-item"
                                                >
                                                    <i className="ti ti-user fs-6" />
                                                    <p className="mb-0 fs-3">My Profile</p>
                                                </a>
                                                <a
                                                    href="javascript:void(0)"
                                                    className="d-flex align-items-center gap-2 dropdown-item"
                                                >
                                                    <i className="ti ti-mail fs-6" />
                                                    <p className="mb-0 fs-3">My Account</p>
                                                </a>
                                                <a
                                                    href="javascript:void(0)"
                                                    className="d-flex align-items-center gap-2 dropdown-item"
                                                >
                                                    <i className="ti ti-list-check fs-6" />
                                                    <p className="mb-0 fs-3">My Task</p>
                                                </a>
                                                <a
                                                    onClick={logout}
                                                    className="btn btn-outline-primary mx-3 mt-2 d-block"
                                                >
                                                    Logout
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </header>
                </div>
            </div>
        </>

    )
}

export default Navbar