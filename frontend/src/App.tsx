import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InstructionsPage from './pages/InstructionsPage';
import AllPatternsPage from './pages/AllPatternsPage';
import LoginPage from "./pages/LoginPage";
import SignupPage from './pages/SignupPage';
import PatternPage from './pages/PatternPage';
import PatternProjectPage from './pages/PatternProjectPage';
import AllProjectsPage from './pages/AllProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

function App() {
    return (<Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pattern" element={<PatternPage />} />
            <Route path="/project/new" element={<PatternProjectPage />} />
            <Route path="/patterns" element={<AllPatternsPage />} />
            <Route path="/projects" element={<AllProjectsPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/instructions/:type/:id" element={<InstructionsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    </Router>)
}

export default App
