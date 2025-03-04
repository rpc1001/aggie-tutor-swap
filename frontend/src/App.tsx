import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp.tsx';
import CourseSelection from './pages/CourseSelection.tsx';
import ContactInfo from './pages/ContactInfo.tsx';
import Summary from './pages/Summary.tsx';
import Home from './pages/Home.tsx';
import Verified from './pages/Verified.tsx'
import Login from './pages/Login.tsx'
import ViewMatches from './pages/ViewMatches.tsx'
import EditProfile from './pages/EditProfile.tsx'

function App() {
  return (
    <div className="bg-background font-sans text-text min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/courses" element={<CourseSelection />} />
          <Route path="/contact-info" element={<ContactInfo />} />
          <Route path="/summary" element={<Summary />} />
          <Route path = "/verified" element = {<Verified />} />
          <Route path = "/login" element = {<Login />} />
          <Route path = "/view-matches" element = {<ViewMatches />} />
          <Route path = "/edit-profile" element = {<EditProfile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
