import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InstructionsPage from './pages/InstructionsPage';
import AllNewPatternsPage from './pages/AllNewPatternsPage';
import LoginPage from "./pages/LoginPage";
import SignupPage from './pages/SignupPage';
import NewPatternPage from './pages/NewPatternPage';
import NewPatternProjectPage from './pages/NewPatternProjectPage';
import AllNewProjectsPage from './pages/AllNewProjectsPage';
import NewProjectDetailPage from './pages/NewProjectDetailPage';

function App() {
    return (<Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/new-pattern" element={<NewPatternPage />} />
            <Route path="/new-pattern-project" element={<NewPatternProjectPage />} />
            <Route path="/all-new-patterns" element={<AllNewPatternsPage />} />
            <Route path="/all-new-projects" element={<AllNewProjectsPage />} />
            <Route path="/new-project/:id" element={<NewProjectDetailPage />} />
            <Route path="/instructions/:type/:id" element={<InstructionsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    </Router>)
}

export default App
