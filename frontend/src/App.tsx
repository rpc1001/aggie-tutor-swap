import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp.tsx';
import CourseSelection from "./pages/CourseSelection.tsx" 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} /> 
        <Route path="/signup" element={<SignUp />} />
        <Route path="/courses" element={<CourseSelection/>}/>
      </Routes>
    </Router>
  );
}

export default App;
