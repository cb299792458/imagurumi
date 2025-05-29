import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import PatternPage from './pages/PatternPage';
import ProjectPage from './pages/ProjectPage';
import AllProjectsPage from './pages/AllProjectsPage';

function App() {
    return (<Router>
        <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/pattern" element={<PatternPage />} />
            <Route path="/project/:id" element={<ProjectPage />} />
            <Route path="/all-projects" element={<AllProjectsPage />} />
        </Routes>
    </Router>)
}

export default App
