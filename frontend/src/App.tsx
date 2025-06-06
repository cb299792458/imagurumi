import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatternPage from './pages/PatternPage';
import ProjectPage from './pages/ProjectPage';
import AllProjectsPage from './pages/AllProjectsPage';
import NewProjectPage from './pages/NewProjectPage';
import NavBar from './components/NavBar';

function App() {
    return (<Router>
        <Routes>
            <Route path="/" element={<><h1>Home</h1><NavBar/></>} />
            <Route path="/pattern" element={<PatternPage />} />
            <Route path="/project" element={<NewProjectPage />} />
            <Route path="/project/:id" element={<ProjectPage />} />
            <Route path="/all-projects" element={<AllProjectsPage />} />

            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    </Router>)
}

export default App
