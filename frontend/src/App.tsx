import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PatternPage from './pages/PatternPage';
import NewProjectPage from './pages/NewProjectPage';
import ProjectPage from './pages/ProjectPage';
import InstructionsPage from './pages/InstructionsPage';
import AllProjectsPage from './pages/AllProjectsPage';
import AllNewPatternsPage from './pages/AllNewPatternsPage';
import TestPage from './pages/TestPageStuff/TestPage';
import LoginPage from "./pages/LoginPage";
import SignupPage from './pages/SignupPage';
import NewPatternPage from './pages/NewPatternPage';

function App() {
    return (<Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pattern" element={<PatternPage />} />
            <Route path="/new-pattern" element={<NewPatternPage />} />
            <Route path="/all-new-patterns" element={<AllNewPatternsPage />} />
            <Route path="/project" element={<NewProjectPage />} />
            <Route path="/project/:id" element={<ProjectPage />} />
            <Route path="/instructions/:type/:id" element={<InstructionsPage />} />
            <Route path="/all-projects" element={<AllProjectsPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    </Router>)
}

export default App
