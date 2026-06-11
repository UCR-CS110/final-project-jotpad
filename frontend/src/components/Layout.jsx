import { Link, Outlet } from 'react-router-dom';

export default function Layout({}) {
    return (
        <>
            <nav id="navbar">
                <div className="nav-logo">
                    <Link to="/dashboard" className="logo-jotpad">Jotpad</Link>
                </div>
                
                <div className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/storyeditor">Write Story</Link>
                    <Link to="/betarequests">Find Beta Requests</Link>
                    <Link to="/story">Discover Stories</Link>
                </div>
                    
                <div className="nav-right-side">
                    <div className="search-all">
                        <input type="text" id="searchbar-all" placeholder="Search" />
                        <button id="search-button-all">Search</button>
                    </div>
                    
                    <Link to="/logout" className="logout-btn">Logout</Link>
                </div>
            </nav>

            <main>
                <Outlet />
            </main>
        </>
    );
}