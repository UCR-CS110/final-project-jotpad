import { Link, Outlet } from 'react-router-dom';

export default function Layout({}) {
    return (
        <>
        <nav id="navbar" style={{ background: '#333', padding: '15px' }}>
        <Link to="/logout" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Logout</Link>
        <Link to="/dashboard" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/storyeditor" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Write Story</Link>
        <Link to="/betarequests" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Find Beta Requests</Link>
        <Link to="/story" style={{ color: 'white', textDecoration: 'none' }}>Discover Stories</Link>
            
        <div className="search-all">
          <input type="text" id="searchbar-all" placeholder="Search" />
          <button id="search-button-all">Search</button>
        </div>
            
      </nav>
      <main>
        <Outlet />
      </main>
      </>
    );

}