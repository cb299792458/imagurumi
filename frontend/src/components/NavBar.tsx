import { NavLink, useLocation } from 'react-router-dom';
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
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <NavBarItem to="/" name="Home" />
        <NavBarItem to="/pattern" name="Patterns" />
        <NavBarItem to="/all-projects" name="All Projects" />
        <NavBarItem to="/project" name="New Project" />
      </ul>
    </nav>
  );
};

export default NavBar;
