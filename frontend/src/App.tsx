import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PatternPage from './pages/PatternPage';
import NewProjectPage from './pages/NewProjectPage';
import ProjectPage from './pages/ProjectPage';
import InstructionsPage from './pages/InstructionsPage';
import AllProjectsPage from './pages/AllProjectsPage';

function App() {
    return (<Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pattern" element={<PatternPage />} />
            <Route path="/project" element={<NewProjectPage />} />
            <Route path="/project/:id" element={<ProjectPage />} />
            <Route path="/instructions/:type/:id" element={<InstructionsPage />} />
            <Route path="/all-projects" element={<AllProjectsPage />} />

            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    </Router>)
}

export default App
