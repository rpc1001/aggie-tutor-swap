import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp.tsx';
import CourseSelection from "./pages/CourseSelection.tsx" 
import ContactInfo from './pages/ContactInfo.tsx';
function App() {
  return (
    <div className = "bg-background font-sans text-text min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} /> 
          <Route path="/signup" element={<SignUp />} />
          <Route path="/courses" element={<CourseSelection/>}/>
          <Route path="/contact-info" element={<ContactInfo/>}/>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
