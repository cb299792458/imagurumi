import React from 'react';
import NavBar from '../components/NavBar';
import styles from './Layout.module.css';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className={styles.layout}>
            <NavBar />
            <main className={styles.main}>
                {children}
            </main>
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerBadge}>
                        🧶 VisuWOOLizer
                    </div>
                    <p className={styles.footerText}>
                        © 2025 <a 
                            href="https://www.linkedin.com/in/brian-lam-software-developer/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.footerLink}
                        >
                            Brian Lam
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
