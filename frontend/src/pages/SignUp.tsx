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
<div className="p-8 bg-zinc-900 flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        Sign Up
      </h1>
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleNext} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-text font-semibold mb-2">
              UC Davis Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border outline-none border-gray-600 bg-zinc-700 p-2 rounded w-full text-text"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-text font-semibold mb-2">
              Any Password
            </label>
            <input
              type="password"
              id="password"
              placeholder = "At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6} 
              className="border outline-none border-gray-600 bg-zinc-700 p-2 rounded w-full text-text"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-secondary text-white py-2 px-4 rounded hover:brightness-75 w-full font-semibold"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
