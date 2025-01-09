import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp.tsx';
import CourseSelection from "./pages/CourseSelection.tsx" 
function App() {
  return (
    <div className = "bg-background font-sans text-text min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} /> 
          <Route path="/signup" element={<SignUp />} />
          <Route path="/courses" element={<CourseSelection/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
