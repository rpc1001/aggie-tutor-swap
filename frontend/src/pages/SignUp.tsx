import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // move on to course selection
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/courses', { state: { email, password } });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        Sign Up
      </h1>
      <form onSubmit={handleNext} className="flex flex-col">
        <input
          type="email"
          placeholder="UC Davis Email"
          className="border outline-none border-gray-600 bg-zinc-800 p-2 rounded mb-4 text-text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Any Password"
          className="border outline-none border-gray-600 bg-zinc-800 p-2 rounded mb-6 text-text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-secondary text-white py-2 px-4 rounded hover:brightness-75"
        >
          <p className="font-semibold">Next</p>
        </button>
      </form>
    </div>
  );
};

export default SignUp;
