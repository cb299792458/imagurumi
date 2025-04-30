import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import PatternPage from './pages/PatternPage';
import ProjectPage from './pages/ProjectPage';

function App() {
    return (<Router>
        <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/pattern" element={<PatternPage />} />
            <Route path="/project" element={<ProjectPage />} />
        </Routes>
    </Router>)
}

export default App
