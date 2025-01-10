import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('http://localhost:3001/api/login', {
        email,
        password,
      });

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="p-8 bg-zinc-900 flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        Log In
      </h1>
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-6">
          {errorMessage && (
            <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
          )}
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-text font-semibold mb-2">
              Email
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
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border outline-none border-gray-600 bg-zinc-700 p-2 rounded w-full text-text"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-secondary text-white py-2 px-4 rounded hover:brightness-75 w-full font-semibold"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
