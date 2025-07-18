import { NavLink, useLocation } from 'react-router-dom';

const NavBarItem = ({ to, name }: { to: string, name: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return <li style={ isActive ? { color: 'gray', cursor: 'default', pointerEvents: 'none' } : {color: 'black'} }>
        <NavLink to={to} className={isActive ? 'active' : ''} style={isActive ? {color: 'black', fontWeight: 'bold', textDecoration: 'none'} : {}}>
            {name}
        </NavLink>
    </li>
}

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul style={{ listStyle: 'none' }}>
        <NavBarItem to="/" name="Home" />
        <NavBarItem to="/pattern" name="Patterns" />
        <NavBarItem to="/all-projects" name="All Projects" />
        <NavBarItem to="/project" name="New Project" />
      </ul>
    </nav>
  );
};

export default NavBar;
