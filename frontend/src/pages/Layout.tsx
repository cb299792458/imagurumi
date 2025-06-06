import React from 'react';
import NavBar from '../components/NavBar';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="layout">
            <NavBar />
            <main style={{ padding: '10px' }}>
                {children}
            </main>
            <footer style={{ textAlign: 'center', padding: '10px', marginTop: 'auto', background: '#f0f0f0' }}>
                <p>
                    © 2025 <a href="https://www.linkedin.com/in/brian-lam-software-developer/" target="_blank" rel="noopener noreferrer">
                        Brian Lam
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default Layout;
