import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApolloClient } from "@apollo/client";
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
  const client = useApolloClient();

  const token = localStorage.getItem("imagurumiToken");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    localStorage.removeItem("imagurumiToken");
    localStorage.removeItem("user");
    localStorage.removeItem("app_guest_id");

    const newGuestId = crypto.randomUUID();
    localStorage.setItem("app_guest_id", newGuestId);
    
    await client.clearStore();
    navigate("/"); // go back to home after logout
  };
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <NavBarItem to="/" name="Home" />
        <NavBarItem to="/patterns" name="Patterns" />
        <NavBarItem to="/pattern" name="Create Pattern" />
        <NavBarItem to="/projects" name="Projects" />
        <NavBarItem to="/project/new" name="Create Project" />
        
        <li className={styles.logLink}>
          {token && user ? (
            <span>Hi {user.username}!</span>
          ) : (
            <span>Not logged in</span>
          )}

          {" "}

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
