import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styles from './NavBar.module.css';

const NavBarItem = ({ to, name }: { to: string, name: string }) => {    
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return (
        <li className={styles.navItem}>
            <NavLink 
                to={to} 
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
                {name}
            </NavLink>
        </li>
    );
}

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("imagurumiToken");

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    localStorage.removeItem("imagurumiToken");
    navigate("/"); // go back to home after logout
  };
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <NavBarItem to="/" name="Home" />
        <NavBarItem to="/pattern" name="Patterns" />
        <NavBarItem to="/all-projects" name="All Projects" />
        <NavBarItem to="/all-new-projects" name="All New Projects" />
        <NavBarItem to="/project" name="New Project" />
        <NavBarItem to="/new-pattern-project" name="New Pattern Project" />
        
        <li className={styles.logLink}>
          {token ? "Logged in" : "Not logged in"}
          {token ? (
            <span onClick={handleLogout} className={styles.navLink}>
              Logout
            </span>
          ) : (
            <NavLink to="/login" className={styles.navLink}>
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
