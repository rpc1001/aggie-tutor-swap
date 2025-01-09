import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} /> 
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
